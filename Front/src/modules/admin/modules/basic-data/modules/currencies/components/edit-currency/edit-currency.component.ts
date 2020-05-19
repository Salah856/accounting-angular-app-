import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Currency } from '../../models/currency.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrenciesService } from '../../services';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';

@Component({
  selector: 'acc-edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.scss']
})
export class EditCurrencyComponent extends SmartComponent implements OnInit, OnDestroy {
  currency: Currency;
  currencyId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currenciesService: CurrenciesService,
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
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.currenciesService.addCurrency(this.currency);
    if (this.currencyId) {
      request = this.currenciesService.editCurrency(this.currency);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.currencyId) {
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
