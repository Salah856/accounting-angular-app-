import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemTypesService } from './services';


@Component({
  selector: 'acc-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.scss']
})
export class ItemTypesComponent implements OnInit, OnDestroy  {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private itemTypesService: ItemTypesService,
  ) {

  }

  ngOnInit() {
    this.subscription = this.itemTypesService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
