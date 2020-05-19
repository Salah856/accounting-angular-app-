import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, StorePopulated } from '../../models/store.model';
import { StoresService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-store',
  templateUrl: './list-store.component.html',
  styleUrls: ['./list-store.component.scss']
})
export class ListStoreComponent extends PagedComponent implements OnInit, OnDestroy {
  stores: StorePopulated[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'STORE_NAME', sortable: true, filter: true },
    { name: 'active.label', serverTranslate: true, label: 'ACTIVE', sortable: false, filter: false },
    { name: 'createdAt', label: 'CREATED_AT', sortable: true, filter: true, customTemplate: true },
    { name: 'email', label: 'EMAIL', sortable: true, filter: true },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private storesService: StoresService,
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
    this.stores = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.storesService.getStores({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.stores = data.stores;
          this.rights = data.rights;
          this.storesService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteStore(store: Store, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_STORE',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteStore(store, index);
        }
      }
    );
  }
  deleteStore(store: Store, index: number) {
    this.beforeLoadingData();
    this.storesService.deleteStore(store)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.stores = [
            ...this.stores.slice(0, index),
            ...this.stores.slice(index + 1)
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
