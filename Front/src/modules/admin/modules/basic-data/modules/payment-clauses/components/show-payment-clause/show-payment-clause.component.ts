import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { PaymentClausesService } from '../../services';
import { PaymentClause, PaymentClausePopulated } from '../../models/payment-clause.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'acc-show-payment-clause',
  templateUrl: './show-payment-clause.component.html',
  styleUrls: ['./show-payment-clause.component.scss']
})
export class ShowPaymentClauseComponent extends SmartComponent implements OnInit, OnDestroy {

  paymentClause: PaymentClausePopulated;
  rights: {[key: string]: boolean};
  paymentClauseId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private paymentClausesService: PaymentClausesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.paymentClause = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.paymentClauseId = snapshot.get('id');
          if (this.paymentClauseId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.paymentClausesService.getPaymentClause(this.paymentClauseId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.paymentClause = res.paymentClause as PaymentClausePopulated;
          this.rights = res.rights;
          this.paymentClausesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeletePaymentClause() {
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
          this.deletePaymentClause();
        }
      }
    );
  }
  deletePaymentClause() {
    this.beforeLoadingData();
    this.paymentClausesService.deletePaymentClause(this.paymentClause)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  ngOnDestroy() {
    this.onDestroy();
  }

}
