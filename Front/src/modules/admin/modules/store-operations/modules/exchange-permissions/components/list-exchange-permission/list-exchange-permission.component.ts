import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExchangePermission, ExchangePermissionPopulated } from '../../models/exchange-permission.model';
import { ExchangePermissionsService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-exchange-permission',
  templateUrl: './list-exchange-permission.component.html',
  styleUrls: ['./list-exchange-permission.component.scss']
})
export class ListExchangePermissionComponent extends PagedComponent implements OnInit, OnDestroy {
  exchangePermissions: ExchangePermission[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'date', label: 'EXCHANGE_PERMISSION_DATE', sortable: true, filter: true, customTemplate: true },
    { name: 'store.name', label: 'STORE', sortable: false, filter: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private exchangePermissionsService: ExchangePermissionsService,
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
    this.exchangePermissions = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.exchangePermissionsService.getExchangePermissions({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.exchangePermissions = data.exchangePermissions;
          this.rights = data.rights;
          this.exchangePermissionsService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteExchangePermission(exchangePermission: ExchangePermission, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_EXCHANGE_PERMISSION',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteExchangePermission(exchangePermission, index);
        }
      }
    );
  }
  deleteExchangePermission(exchangePermission: ExchangePermission, index: number) {
    this.beforeLoadingData();
    this.exchangePermissionsService.deleteExchangePermission(exchangePermission)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.exchangePermissions = [
            ...this.exchangePermissions.slice(0, index),
            ...this.exchangePermissions.slice(index + 1)
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
