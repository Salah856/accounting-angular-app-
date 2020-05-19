import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExchangeRequestsService } from './services';


@Component({
  selector: 'acc-exchange-requests',
  templateUrl: './exchange-requests.component.html',
  styleUrls: ['./exchange-requests.component.scss']
})
export class ExchangeRequestsComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private exchangeRequestsService: ExchangeRequestsService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.exchangeRequestsService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
