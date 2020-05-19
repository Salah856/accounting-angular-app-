import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UserPopulated } from '../../models/user.model';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/modules/admin/services/users.service';

@Component({
  selector: 'acc-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent extends PagedComponent implements OnInit, OnDestroy {
  users: UserPopulated[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'USER_FULLNAME', sortable: true, filter: true },
    { name: 'username', label: 'USERNAME', sortable: true, filter: true },
    { name: 'active.label', serverTranslate: true, label: 'ACTIVE', sortable: false, filter: false },
    { name: 'email', label: 'EMAIL', sortable: true, filter: true },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private usersService: UsersService,
    private toastService: ToastService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
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
    this.users = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.usersService.getUsers({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.users = data.users;
          this.rights = data.rights;
          this.usersService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteUser(user: User, index: number) {
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
          this.deleteUser(user, index);
        }
      }
    );
  }
  deleteUser(user: User, index: number) {
    this.beforeLoadingData();
    this.usersService.deleteUser(user)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.users = [
            ...this.users.slice(0, index),
            ...this.users.slice(index + 1)
          ];
          this.toastService
            .showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onPage(pageEvent: PageEvent) {
    super.onPage(pageEvent);
    this.loadData();
  }
  onRowClick(event: RowClickEvent) {
    this.router.navigate(['./', event.item._id], { relativeTo: this.route });
  }

  onSort(event: Sort) {
    if (event.direction) {
      this.sortField = event.active;
      this.sortDirection = event.direction;
    } else {
      this.sortField = null;
      this.sortDirection = null;
    }
    this.loadData();
  }
  ngOnDestroy() {
    this.onDestroy();
  }
}
