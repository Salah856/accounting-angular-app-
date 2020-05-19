import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemsService } from './services';
import { Subscription } from 'rxjs';


@Component({
  selector: 'acc-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private itemsService: ItemsService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.itemsService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
