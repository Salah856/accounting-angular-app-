import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExchangePermissionsService } from './services';


@Component({
  selector: 'acc-exchange-permissions',
  templateUrl: './exchange-permissions.component.html',
  styleUrls: ['./exchange-permissions.component.scss']
})
export class ExchangePermissionsComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private exchangePermissionsService: ExchangePermissionsService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.exchangePermissionsService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
