import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddingPermission, AddingPermissionPopulated } from '../../models/adding-permission.model';
import { AddingPermissionsService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-adding-permission',
  templateUrl: './list-adding-permission.component.html',
  styleUrls: ['./list-adding-permission.component.scss']
})
export class ListAddingPermissionComponent extends PagedComponent implements OnInit, OnDestroy {
  addingPermissions: AddingPermission[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'date', label: 'ADDING_PERMISSION_DATE', sortable: true, filter: true, customTemplate: true },
    { name: 'store.name', label: 'STORE', sortable: false, filter: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private addingPermissionsService: AddingPermissionsService,
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
    this.addingPermissions = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.addingPermissionsService.getAddingPermissions({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.addingPermissions = data.addingPermissions;
          this.rights = data.rights;
          this.addingPermissionsService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteAddingPermission(addingPermission: AddingPermission, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ADDING_PERMISSION',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteAddingPermission(addingPermission, index);
        }
      }
    );
  }
  deleteAddingPermission(addingPermission: AddingPermission, index: number) {
    this.beforeLoadingData();
    this.addingPermissionsService.deleteAddingPermission(addingPermission)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.addingPermissions = [
            ...this.addingPermissions.slice(0, index),
            ...this.addingPermissions.slice(index + 1)
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
