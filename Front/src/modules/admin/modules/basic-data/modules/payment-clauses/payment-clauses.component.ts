import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaymentClausesService } from './services';


@Component({
  selector: 'acc-payment-clauses',
  templateUrl: './payment-clauses.component.html',
  styleUrls: ['./payment-clauses.component.scss']
})
export class PaymentClausesComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private paymentClausesService: PaymentClausesService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.paymentClausesService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
