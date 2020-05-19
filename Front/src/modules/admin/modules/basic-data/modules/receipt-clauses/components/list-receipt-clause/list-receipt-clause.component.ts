import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReceiptClause, ReceiptClausePopulated } from '../../models/receipt-clause.model';
import { ReceiptClausesService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-receipt-clause',
  templateUrl: './list-receipt-clause.component.html',
  styleUrls: ['./list-receipt-clause.component.scss']
})
export class ListReceiptClauseComponent extends PagedComponent implements OnInit, OnDestroy {
  receiptClauses: ReceiptClausePopulated[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'RECEIPT_CLAUSE_NAME', sortable: true, filter: true },
    { name: 'constant.label', serverTranslate: true, label: 'CONSTANT_CLAUSE', sortable: false, filter: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private receiptClausesService: ReceiptClausesService,
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
    this.receiptClauses = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.receiptClausesService.getReceiptClauses({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.receiptClauses = data.receiptClauses;
          this.rights = data.rights;
          this.receiptClausesService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteReceiptClause(receiptClause: ReceiptClause, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_RECEIPT_CLAUSE',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteReceiptClause(receiptClause, index);
        }
      }
    );
  }
  deleteReceiptClause(receiptClause: ReceiptClause, index: number) {
    this.beforeLoadingData();
    this.receiptClausesService.deleteReceiptClause(receiptClause)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.receiptClauses = [
            ...this.receiptClauses.slice(0, index),
            ...this.receiptClauses.slice(index + 1)
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
