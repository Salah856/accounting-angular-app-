import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { App } from '../../models/app.model';
import { MenuItem } from '../header/models/Menu';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'acc-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent extends SmartComponent implements OnInit, OnDestroy {
  apps: App[];
  menuItems: MenuItem[] = [];
  constructor(
    private usersService: UsersService,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
    this.loadData();
  }

  init() {
    this.apps = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.usersService.getUserApps()
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.apps = data.userApps;
          this.menuItems = this.mapAppsToMenuItems(this.apps);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  mapAppsToMenuItems(apps: App[]): MenuItem[] {
    return apps.map(
      (app) => {
        return {
          label: app.arName + '|' + app.enName,
          route: app.route,
          subRoutes: app.children.map(
            (child) => {
              return {
                label: child.arName + '|' + child.enName,
                route: child.route
              };
            }
          ),
        }
      }
    );
  }
  ngOnDestroy() {
    this.onDestroy();
  }
}
