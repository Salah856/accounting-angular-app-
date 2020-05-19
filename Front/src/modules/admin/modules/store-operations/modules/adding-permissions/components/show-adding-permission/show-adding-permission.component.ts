import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { AddingPermissionsService } from '../../services';
import { AddingPermissionPopulated } from '../../models/adding-permission.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';

@Component({
  selector: 'acc-show-adding-permission',
  templateUrl: './show-adding-permission.component.html',
  styleUrls: ['./show-adding-permission.component.scss']
})
export class ShowAddingPermissionComponent extends SmartComponent implements OnInit, OnDestroy {

  addingPermission: AddingPermissionPopulated;
  rights: {[key: string]: boolean};
  addingPermissionId: string;
  columns: TableColumn[] = [
    { name: 'item.name', label: 'ITEM', sortable: false },
    { name: 'quantity', label: 'QUANTITY', sortable: false },
  ];
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private addingPermissionsService: AddingPermissionsService,
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
    this.addingPermission = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.addingPermissionId = snapshot.get('id');
          if (this.addingPermissionId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.addingPermissionsService.getAddingPermission(this.addingPermissionId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.addingPermission = res.addingPermission as AddingPermissionPopulated;
          this.rights = res.rights;
          this.addingPermissionsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteAddingPermission() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ADDING_PERMISSION',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteAddingPermission();
        }
      }
    );
  }
  deleteAddingPermission() {
    this.beforeLoadingData();
    this.addingPermissionsService.deleteAddingPermission(this.addingPermission)
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
  ngOnDestroy() {
    this.onDestroy();
  }
}
