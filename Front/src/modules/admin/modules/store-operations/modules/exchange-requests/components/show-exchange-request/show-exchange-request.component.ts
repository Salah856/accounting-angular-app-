import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ExchangeRequestsService } from '../../services';
import { ExchangeRequestPopulated } from '../../models/exchange-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';

@Component({
  selector: 'acc-show-exchange-request',
  templateUrl: './show-exchange-request.component.html',
  styleUrls: ['./show-exchange-request.component.scss']
})
export class ShowExchangeRequestComponent extends SmartComponent implements OnInit, OnDestroy {

  exchangeRequest: ExchangeRequestPopulated;
  rights: {[key: string]: boolean};
  exchangeRequestId: string;
  columns: TableColumn[] = [
    { name: 'item.name', label: 'ITEM', sortable: false },
    { name: 'quantity', label: 'QUANTITY', sortable: false },
  ];
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private exchangeRequestsService: ExchangeRequestsService,
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
    this.exchangeRequest = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.exchangeRequestId = snapshot.get('id');
          if (this.exchangeRequestId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.exchangeRequestsService.getExchangeRequest(this.exchangeRequestId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.exchangeRequest = res.exchangeRequest as ExchangeRequestPopulated;
          this.rights = res.rights;
          this.exchangeRequestsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  confirmConvertExchangeRequest() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'CONVERT_EXCHANGE_REQUEST',
        message: 'CONVERT_EXCHANGE_REQUEST_CONFIRM',
        isDanger: false,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.convertExchangeRequest();
        }
      }
    );
  }
  convertExchangeRequest() {
    this.beforeLoadingData();
    this.exchangeRequestsService.convertToPermission(this.exchangeRequest)
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
  confirmDeleteExchangeRequest() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_EXCHANGE_REQUEST',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteExchangeRequest();
        }
      }
    );
  }
  deleteExchangeRequest() {
    this.beforeLoadingData();
    this.exchangeRequestsService.deleteExchangeRequest(this.exchangeRequest)
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
