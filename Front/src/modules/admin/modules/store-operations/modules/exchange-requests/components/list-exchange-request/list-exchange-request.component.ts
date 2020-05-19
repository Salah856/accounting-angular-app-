import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExchangeRequest, ExchangeRequestPopulated } from '../../models/exchange-request.model';
import { ExchangeRequestsService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-exchange-request',
  templateUrl: './list-exchange-request.component.html',
  styleUrls: ['./list-exchange-request.component.scss']
})
export class ListExchangeRequestComponent extends PagedComponent implements OnInit, OnDestroy {
  exchangeRequests: ExchangeRequest[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'date', label: 'EXCHANGE_REQUEST_DATE', sortable: true, filter: true, customTemplate: true },
    { name: 'store.name', label: 'STORE', sortable: false, filter: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private exchangeRequestsService: ExchangeRequestsService,
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
    this.exchangeRequests = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.exchangeRequestsService.getExchangeRequests({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.exchangeRequests = data.exchangeRequests;
          this.rights = data.rights;
          this.exchangeRequestsService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteExchangeRequest(exchangeRequest: ExchangeRequest, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_EXCHANGE_REQUEST',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteExchangeRequest(exchangeRequest, index);
        }
      }
    );
  }
  deleteExchangeRequest(exchangeRequest: ExchangeRequest, index: number) {
    this.beforeLoadingData();
    this.exchangeRequestsService.deleteExchangeRequest(exchangeRequest)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.exchangeRequests = [
            ...this.exchangeRequests.slice(0, index),
            ...this.exchangeRequests.slice(index + 1)
          ];
          this.toastService
            .showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onPage(pageEvent: PageEvent) {
    super.onPage(pageEvent);
    this.loadData();
  }
  onRowClick(event: RowClickEvent) {
    this.router.navigate(['./', event.item._id], { relativeTo: this.route });
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
