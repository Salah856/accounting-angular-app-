import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemCategoriesService } from './services';


@Component({
  selector: 'acc-item-categories',
  templateUrl: './item-categories.component.html',
  styleUrls: ['./item-categories.component.scss']
})
export class ItemCategoriesComponent implements OnInit, OnDestroy  {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private itemCategoriesService: ItemCategoriesService,
  ) {

  }

  ngOnInit() {
    this.subscription = this.itemCategoriesService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
