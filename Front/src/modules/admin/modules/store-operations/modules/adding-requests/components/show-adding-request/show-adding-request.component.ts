import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { AddingRequestsService } from '../../services';
import { AddingRequestPopulated } from '../../models/adding-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';

@Component({
  selector: 'acc-show-adding-request',
  templateUrl: './show-adding-request.component.html',
  styleUrls: ['./show-adding-request.component.scss']
})
export class ShowAddingRequestComponent extends SmartComponent implements OnInit, OnDestroy {

  addingRequest: AddingRequestPopulated;
  rights: {[key: string]: boolean};
  addingRequestId: string;
  columns: TableColumn[] = [
    { name: 'item.name', label: 'ITEM', sortable: false },
    { name: 'quantity', label: 'QUANTITY', sortable: false },
  ];
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private addingRequestsService: AddingRequestsService,
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
    this.addingRequest = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.addingRequestId = snapshot.get('id');
          if (this.addingRequestId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.addingRequestsService.getAddingRequest(this.addingRequestId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.addingRequest = res.addingRequest as AddingRequestPopulated;
          this.rights = res.rights;
          this.addingRequestsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  confirmConvertAddingRequest() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'CONVERT_ADDING_REQUEST',
        message: 'CONVERT_ADDING_REQUEST_CONFIRM',
        isDanger: false,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.convertAddingRequest();
        }
      }
    );
  }
  convertAddingRequest() {
    this.beforeLoadingData();
    this.addingRequestsService.convertToPermission(this.addingRequest)
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

  confirmDeleteAddingRequest() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ADDING_REQUEST',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteAddingRequest();
        }
      }
    );
  }
  deleteAddingRequest() {
    this.beforeLoadingData();
    this.addingRequestsService.deleteAddingRequest(this.addingRequest)
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
