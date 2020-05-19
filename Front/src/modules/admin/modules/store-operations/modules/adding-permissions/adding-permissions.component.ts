import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddingPermissionsService } from './services';


@Component({
  selector: 'acc-adding-permissions',
  templateUrl: './adding-permissions.component.html',
  styleUrls: ['./adding-permissions.component.scss']
})
export class AddingPermissionsComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private addingPermissionsService: AddingPermissionsService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.addingPermissionsService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
