import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemUnitsService } from './services';


@Component({
  selector: 'acc-item-units',
  templateUrl: './item-units.component.html',
  styleUrls: ['./item-units.component.scss']
})
export class ItemUnitsComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private itemUnitsService: ItemUnitsService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.itemUnitsService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
