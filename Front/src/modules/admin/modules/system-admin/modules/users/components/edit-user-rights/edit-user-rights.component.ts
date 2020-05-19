import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { User, UserRight, UserRightOptions, UserRightPopulated, UserPopulated } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService, TranslationService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { Observable, forkJoin } from 'rxjs';
import { App, Right, Foundation } from 'src/modules/admin/models';
import { SelectItem } from 'src/modules/shared/components/multi-level-select/models/SelectItem';
import { FoundationsService } from 'src/modules/admin/services/foundations.service';
import { AppsService } from 'src/modules/admin/services/apps.service';
import { UsersService } from 'src/modules/admin/services/users.service';

@Component({
  selector: 'acc-edit-user-rights',
  templateUrl: './edit-user-rights.component.html',
  styleUrls: ['./edit-user-rights.component.scss']
})
export class EditUserRightsComponent extends SmartComponent implements OnInit, OnDestroy {
  user: UserPopulated;
  userRightsPopulated: UserRightPopulated[];
  userId: string;
  userRightOptions: UserRightOptions;
  selectedApp: App;
  selectedFoundation: Foundation;
  selectedRights: string[];
  availableRights: Right[];

  columns: TableColumn[] = [
    { name: 'app', label: 'APP_NAME', customTemplate: true, sortable: false },
    { name: 'scope', label: 'SCOPE', customTemplate: true, sortable: false },
    { name: 'rights', label: 'RIGHTS', customTemplate: true, sortable: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, customTemplate: true, hideLabelInMobile: true },
  ];

  get addRightEnabled() {
    return this.selectedApp && this.selectedApp.childrenCount === 0
      && (this.selectedApp.scopeRequired ? this.selectedFoundation : true)
      && this.selectedRights && this.selectedRights.length > 0;
  }
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private foundationsService: FoundationsService,
    private appsService: AppsService,
    private toastService: ToastService,
    private router: Router,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  getAppName(app: App) {
    return `${app.arName}|${app.enName}`;
  }

  getFoundationName(foundation: Foundation) {
    return `${foundation.arName}|${foundation.enName}`;
  }

  init() {
    this.user = {};
    this.userRightOptions = {};
    this.userRightsPopulated = [];
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.userId = snapshot.get('id');
          if (this.userId) {
            this.loadData();
          }
        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    const requests: Observable<any>[] = [
      this.usersService.getUserRights(this.userId, true),
      this.usersService.getRightOptions(),
    ];
    forkJoin(requests)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.user = res[0].user as UserPopulated;
          this.userRightsPopulated = this.user.userRights || [];
          this.userRightOptions = res[1].options;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onFoundationChange(item: Foundation) {
    this.selectedFoundation = item;
  }

  onAppChange(item: App) {
    this.selectedApp = item;
    if (item.rights) {
      this.availableRights = item.rights.map(
        (rightId) => {
          return this.userRightOptions.rights.find(right => right._id === rightId);
        }
      );
      if (this.selectedRights) {
        this.selectedRights = this.selectedRights
          .filter((right) => item.rights.find(rightId => rightId === right));
      }
    } else {
      this.availableRights = this.userRightOptions.rights;
    }
  }

  addUserRight() {
    const rights = this.selectedRights
      .map(id => this.userRightOptions.rights.find(item => item._id === id));
    this.userRightsPopulated.push({
      app: { ...this.selectedApp },
      scope: this.selectedApp.scopeRequired ? { ...this.selectedFoundation } : {},
      rights,
    });
  }

  removeUserRight(item: UserRightPopulated, index: number) {
    this.userRightsPopulated = [
      ...this.userRightsPopulated.slice(0, index),
      ...this.userRightsPopulated.slice(index + 1),
    ];
  }
  onGetAppParentSiblings(item: SelectItem) {
    const selectedApp = this.userRightOptions.apps.find(app => app._id === item._id);
    let parent: string;
    if (selectedApp.parentTotalId) {
      const parents = selectedApp.parentTotalId.split('.');
      parent = parents[parents.length - 2];
    }
    this.beforeLoadingData();
    this.appsService.getApps({ parent })
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.userRightOptions.apps = res.apps;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  onGetAppChildren(item: SelectItem) {
    this.beforeLoadingData();
    this.appsService.getApps({ parent: item._id })
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.userRightOptions.apps = res.apps;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  onGetFoundationParentSiblings(item: SelectItem) {
    const selectedFound = this.userRightOptions.foundations.find(found => found._id === item._id);
    let parent: string;
    if (selectedFound.parentTotalId) {
      const parents = selectedFound.parentTotalId.split('.');
      parent = parents[parents.length - 2];
    }
    this.beforeLoadingData();
    this.foundationsService.getFoundations({ parent })
      .subscribe(
        (res) => {
          this.afterLoadingData();
          const foundations = (res.foundations as Foundation[]);
          this.userRightOptions.foundations = foundations;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  onGetFoundationChildren(item: SelectItem) {
    this.beforeLoadingData();
    this.foundationsService.getFoundations({ parent: item._id })
      .subscribe(
        (res) => {
          this.afterLoadingData();
          const foundations = (res.foundations as Foundation[]);
          this.userRightOptions.foundations = foundations;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  validateUserRights() {
    this.errors = [];
    if (this.userRightsPopulated.length === 0) {
      this.errors.push('يجب اضافة صلاحية واحدة على الأقل|You have to add at least one right');
      return false;
    }
    for (let i = 0; i < this.userRightsPopulated.length; i++) {
      for (let j = i + 1; j < this.userRightsPopulated.length; j++) {
        const firstUserRight = this.userRightsPopulated[i];
        const secondUserRight = this.userRightsPopulated[j];
        const sameAppCond = firstUserRight.app._id === secondUserRight.app._id;
        const sameScopeCond = !(firstUserRight.scope && secondUserRight.scope)
          || firstUserRight.scope._id === secondUserRight.scope._id;

        if (sameAppCond) {
          if (sameScopeCond) {
            this.errors.push('لا يمكن تكرار الصلاحيات على نفس الموسسة و التطبيق|Duplicate Rights For The Same Foundation And Scope');
            return false;
          }
          const firstIsParentCond = secondUserRight.scope.parentTotalId ?
            secondUserRight.scope.parentTotalId.indexOf(firstUserRight.scope._id) !== -1 : false;
          const secondIsParentCond = firstUserRight.scope.parentTotalId ?
            firstUserRight.scope.parentTotalId.indexOf(secondUserRight.scope._id) !== -1 : false;
          if (firstIsParentCond || secondIsParentCond) {
            this.errors
              .push('لا يمكن اعطاء صلاحيات على مؤسسات متداخلة|Can\'t Give Rights for The Same App On Both Parent And Child Foundations');
            return false;
          }
        }
      }
    }
    return true;
  }
  onSubmit() {
    if (!this.validateUserRights()) {
      return;
    }
    this.beforeLoadingData();
    const user: User = {
      _id: this.user._id,
      userRights: this.userRightsPopulated.map(
        (userRightPopulated) => {
          return {
            app: userRightPopulated.app._id,
            scope: userRightPopulated.scope ? (userRightPopulated.scope._id || null) : null,
            rights: userRightPopulated.rights.map(right => right._id),
          };
        }
      )
    };
    this.usersService.editUserRights(user)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.toastService
            .showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
          this.router.navigate(['../../../', this.user._id], { relativeTo: this.route });
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  ngOnDestroy() {
    this.onDestroy();
  }

}
