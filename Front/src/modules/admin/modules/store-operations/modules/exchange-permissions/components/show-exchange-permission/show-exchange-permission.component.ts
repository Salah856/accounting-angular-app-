import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ExchangePermissionsService } from '../../services';
import { ExchangePermissionPopulated } from '../../models/exchange-permission.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';

@Component({
  selector: 'acc-show-exchange-permission',
  templateUrl: './show-exchange-permission.component.html',
  styleUrls: ['./show-exchange-permission.component.scss']
})
export class ShowExchangePermissionComponent extends SmartComponent implements OnInit, OnDestroy {

  exchangePermission: ExchangePermissionPopulated;
  rights: {[key: string]: boolean};
  exchangePermissionId: string;
  columns: TableColumn[] = [
    { name: 'item.name', label: 'ITEM', sortable: false },
    { name: 'quantity', label: 'QUANTITY', sortable: false },
  ];
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private exchangePermissionsService: ExchangePermissionsService,
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
    this.exchangePermission = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.exchangePermissionId = snapshot.get('id');
          if (this.exchangePermissionId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.exchangePermissionsService.getExchangePermission(this.exchangePermissionId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.exchangePermission = res.exchangePermission as ExchangePermissionPopulated;
          this.rights = res.rights;
          this.exchangePermissionsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteExchangePermission() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_EXCHANGE_PERMISSION',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteExchangePermission();
        }
      }
    );
  }
  deleteExchangePermission() {
    this.beforeLoadingData();
    this.exchangePermissionsService.deleteExchangePermission(this.exchangePermission)
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
