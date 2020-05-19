import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompaniesService } from './services';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'acc-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private companiesService: CompaniesService,
  ) {

  }

  ngOnInit() {
    this.subscription = this.companiesService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
