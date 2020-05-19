import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddingRequest, AddingRequestPopulated } from '../../models/adding-request.model';
import { AddingRequestsService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-adding-request',
  templateUrl: './list-adding-request.component.html',
  styleUrls: ['./list-adding-request.component.scss']
})
export class ListAddingRequestComponent extends PagedComponent implements OnInit, OnDestroy {
  addingRequests: AddingRequest[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'date', label: 'ADDING_REQUEST_DATE', sortable: true, filter: true, customTemplate: true },
    { name: 'store.name', label: 'STORE', sortable: false, filter: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private addingRequestsService: AddingRequestsService,
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
    this.addingRequests = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.addingRequestsService.getAddingRequests({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.addingRequests = data.addingRequests;
          this.rights = data.rights;
          this.addingRequestsService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteAddingRequest(addingRequest: AddingRequest, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ADDING_REQUEST',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteAddingRequest(addingRequest, index);
        }
      }
    );
  }
  deleteAddingRequest(addingRequest: AddingRequest, index: number) {
    this.beforeLoadingData();
    this.addingRequestsService.deleteAddingRequest(addingRequest)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.addingRequests = [
            ...this.addingRequests.slice(0, index),
            ...this.addingRequests.slice(index + 1)
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
