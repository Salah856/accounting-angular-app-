import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/modules/admin/services/users.service';


@Component({
  selector: 'acc-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private usersService: UsersService,
  ) {

  }
  ngOnInit() {
    this.subscription = this.usersService.getAppRights()
      .subscribe(rights => this.rights = rights);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
