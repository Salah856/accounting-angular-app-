import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ReceiptClausesService } from '../../services';
import { ReceiptClause, ReceiptClausePopulated } from '../../models/receipt-clause.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'acc-show-receipt-clause',
  templateUrl: './show-receipt-clause.component.html',
  styleUrls: ['./show-receipt-clause.component.scss']
})
export class ShowReceiptClauseComponent extends SmartComponent implements OnInit, OnDestroy {

  receiptClause: ReceiptClausePopulated;
  rights: {[key: string]: boolean};
  receiptClauseId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private receiptClausesService: ReceiptClausesService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.receiptClausesService.getReceiptClause(this.receiptClauseId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.receiptClause = res.receiptClause as ReceiptClausePopulated;
          this.rights = res.rights;
          this.receiptClausesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteReceiptClause() {
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
          this.deleteReceiptClause();
        }
      }
    );
  }
  deleteReceiptClause() {
    this.beforeLoadingData();
    this.receiptClausesService.deleteReceiptClause(this.receiptClause)
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
