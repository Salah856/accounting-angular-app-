import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { CurrenciesService } from '../../services';
import { Currency } from '../../models/currency.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';

@Component({
  selector: 'acc-show-currency',
  templateUrl: './show-currency.component.html',
  styleUrls: ['./show-currency.component.scss']
})
export class ShowCurrencyComponent extends SmartComponent implements OnInit, OnDestroy {

  currency: Currency;
  rights: {[key: string]: boolean};
  currencyId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private currenciesService: CurrenciesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.currency = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.currencyId = snapshot.get('id');
          if (this.currencyId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.currenciesService.getCurrency(this.currencyId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.currency = res.currency;
          this.rights = res.rights;
          this.currenciesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteCurrency() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_CURRENCY',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteCurrency();
        }
      }
    );
  }

  deleteCurrency() {
    this.beforeLoadingData();
    this.currenciesService.deleteCurrency(this.currency)
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
