import { Component, OnInit, OnDestroy } from '@angular/core';
import { Currency } from '../../models/currency.model';
import { CurrenciesService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'acc-list-currency',
  templateUrl: './list-currency.component.html',
  styleUrls: ['./list-currency.component.scss']
})
export class ListCurrencyComponent extends PagedComponent implements OnInit, OnDestroy {
  currencies: Currency[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'CURRENCY_NAME', sortable: true, filter: true },
    { name: 'symbol', label: 'CURRENCY_SYMBOL', sortable: false, filter: true },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private currenciesService: CurrenciesService,
    private toastService: ToastService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
    this.loadData();
  }

  init() {
    this.currencies = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.currenciesService.getCurrencies({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.currencies = data.currencies;
          this.rights = data.rights;
          this.currenciesService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteCurrency(currency: Currency, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_CURRENCY',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteCurrency(currency, index);
        }
      }
    );
  }
  deleteCurrency(currency: Currency, index: number) {
    this.beforeLoadingData();
    this.currenciesService.deleteCurrency(currency)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.currencies = [
            ...this.currencies.slice(0, index),
            ...this.currencies.slice(index + 1)
          ];
          this.toastService
            .showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  onRowClick(event: RowClickEvent) {
    this.router.navigate(['./', event.item._id], { relativeTo: this.route });
  }

  onPage(pageEvent: PageEvent) {
    super.onPage(pageEvent);
    this.loadData();
  }

  onSort(event: Sort) {
    if (event.direction) {
      this.sortField = event.active;
      this.sortDirection = event.direction;
    } else {
      this.sortField = null;
      this.sortDirection = null;
    }
    this.loadData();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
