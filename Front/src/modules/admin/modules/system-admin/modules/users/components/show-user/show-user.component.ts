import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { User, UserPopulated } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { baseUrl } from 'src/api-config';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { UsersService } from 'src/modules/admin/services/users.service';

@Component({
  selector: 'acc-show-user',
  templateUrl: './show-user.component.html',
  styleUrls: ['./show-user.component.scss']
})
export class ShowUserComponent extends SmartComponent implements OnInit, OnDestroy {

  user: UserPopulated;
  rights: {[key: string]: boolean};
  userId: string;
  rightColumns: TableColumn[] = [
    { name: 'app', label: 'APP_NAME', customTemplate: true, sortable: false, filter: true },
    { name: 'scope', label: 'SCOPE', customTemplate: true, sortable: false, filter: true },
    { name: 'rights', label: 'RIGHTS', customTemplate: true,  sortable: false, filter: false },
  ];
  get imageUrl() {
    return this.user.imageUrl ?
      `${baseUrl}${this.user.imageUrl}` : null;
  }

  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private toastService: ToastService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.user = {};
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
    this.usersService.getUser(this.userId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.user = res.user as UserPopulated;
          this.rights = res.rights;
          this.usersService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteUserRights() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_RIGHTS',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteUserRights();
        }
      }
    );
  }

  deleteUserRights() {
    this.beforeLoadingData();
    this.usersService.deleteUserRights(this.user)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.toastService
          .showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteUser() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_USER',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteUser();
        }
      }
    );
  }
  deleteUser() {
    this.beforeLoadingData();
    this.usersService.deleteUser(this.user)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSelectedIndexChange(tabIndex: number) {
    if (tabIndex === 1 && !this.user.userRights) {
      this.loadUserRights();
    }
  }

  loadUserRights() {
    this.beforeLoadingData();
    this.usersService.getUserRights(this.userId, true)
    .subscribe(
      (data) => {
        this.user = { ...this.user, ...(data.user as UserPopulated) };
        this.rights = data.rights;
        this.usersService.setAppRights(data.rights);
        this.afterLoadingData();
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
