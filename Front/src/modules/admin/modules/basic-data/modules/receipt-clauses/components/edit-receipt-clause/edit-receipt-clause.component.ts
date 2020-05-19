import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ReceiptClause } from '../../models/receipt-clause.model';
import { ReceiptClausesService } from '../../services/receipt-clauses.service';

@Component({
  selector: 'acc-edit-receipt-clause',
  templateUrl: './edit-receipt-clause.component.html',
  styleUrls: ['./edit-receipt-clause.component.scss']
})
export class EditReceiptClauseComponent extends SmartComponent implements OnInit, OnDestroy {
  receiptClause: ReceiptClause;
  receiptClauseId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private receiptClausesService: ReceiptClausesService,
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
    this.receiptClause = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.receiptClauseId = snapshot.get('id');
          if (this.receiptClauseId) {
            this.loadData();
          }
        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    this.receiptClausesService.getReceiptClause(this.receiptClauseId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.receiptClause = res.receiptClause as ReceiptClause;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.receiptClausesService.addReceiptClause(this.receiptClause);
    if (this.receiptClauseId) {
      request = this.receiptClausesService.editReceiptClause(this.receiptClause);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.receiptClauseId) {
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
