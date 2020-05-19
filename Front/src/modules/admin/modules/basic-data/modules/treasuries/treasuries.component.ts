import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreasuriesService } from './services';


@Component({
  selector: 'acc-treasuries',
  templateUrl: './treasuries.component.html',
  styleUrls: ['./treasuries.component.scss']
})
export class TreasuriesComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private treasuriesService: TreasuriesService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.treasuriesService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
