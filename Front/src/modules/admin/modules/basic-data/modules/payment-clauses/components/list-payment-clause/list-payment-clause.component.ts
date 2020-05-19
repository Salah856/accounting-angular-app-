import { Component, OnInit } from '@angular/core';
import { PaymentClause, PaymentClausePopulated } from '../../models/payment-clause.model';
import { PaymentClausesService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-payment-clause',
  templateUrl: './list-payment-clause.component.html',
  styleUrls: ['./list-payment-clause.component.scss']
})
export class ListPaymentClauseComponent extends PagedComponent implements OnInit {
  paymentClauses: PaymentClausePopulated[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'PAYMENT_CLAUSE_NAME', sortable: true, filter: true },
    { name: 'constant.label', serverTranslate: true, label: 'CONSTANT_CLAUSE', sortable: false, filter: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private paymentClausesService: PaymentClausesService,
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
    this.paymentClauses = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.paymentClausesService.getPaymentClauses({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.paymentClauses = data.paymentClauses;
          this.rights = data.rights;
          this.paymentClausesService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeletePaymentClause(paymentClause: PaymentClause, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_PAYMENT_CLAUSE',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deletePaymentClause(paymentClause, index);
        }
      }
    );
  }
  deletePaymentClause(paymentClause: PaymentClause, index: number) {
    this.beforeLoadingData();
    this.paymentClausesService.deletePaymentClause(paymentClause)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.paymentClauses = [
            ...this.paymentClauses.slice(0, index),
            ...this.paymentClauses.slice(index + 1)
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
}
