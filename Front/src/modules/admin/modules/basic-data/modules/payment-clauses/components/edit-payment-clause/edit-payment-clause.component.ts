import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { PaymentClause } from '../../models/payment-clause.model';
import { PaymentClausesService } from '../../services/payment-clauses.service';

@Component({
  selector: 'acc-edit-payment-clause',
  templateUrl: './edit-payment-clause.component.html',
  styleUrls: ['./edit-payment-clause.component.scss']
})
export class EditPaymentClauseComponent extends SmartComponent implements OnInit, OnDestroy {
  paymentClause: PaymentClause;
  paymentClauseId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentClausesService: PaymentClausesService,
    private toastService: ToastService,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
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
    this.paymentClausesService.getPaymentClause(this.paymentClauseId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.paymentClause = res.paymentClause as PaymentClause;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.paymentClausesService.addPaymentClause(this.paymentClause);
    if (this.paymentClauseId) {
      request = this.paymentClausesService.editPaymentClause(this.paymentClause);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.paymentClauseId) {
          this.router.navigate(['../../'], { relativeTo: this.route });
        } else {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
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
