import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddingRequestsService } from './services';


@Component({
  selector: 'acc-adding-requests',
  templateUrl: './adding-requests.component.html',
  styleUrls: ['./adding-requests.component.scss']
})
export class AddingRequestsComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private addingRequestsService: AddingRequestsService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.addingRequestsService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
