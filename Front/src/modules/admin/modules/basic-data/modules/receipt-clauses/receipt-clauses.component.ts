import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReceiptClausesService } from './services';


@Component({
  selector: 'acc-receipt-clauses',
  templateUrl: './receipt-clauses.component.html',
  styleUrls: ['./receipt-clauses.component.scss']
})
export class ReceiptClausesComponent implements OnInit, OnDestroy  {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private receiptClausesService: ReceiptClausesService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.receiptClausesService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
