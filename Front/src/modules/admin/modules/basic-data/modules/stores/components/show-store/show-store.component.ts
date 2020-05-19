import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { StoresService } from '../../services';
import { Store, StorePopulated } from '../../models/store.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';

@Component({
  selector: 'acc-show-store',
  templateUrl: './show-store.component.html',
  styleUrls: ['./show-store.component.scss']
})
export class ShowStoreComponent extends SmartComponent implements OnInit, OnDestroy {

  store: StorePopulated;
  rights: {[key: string]: boolean};
  storeId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private storesService: StoresService,
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
    this.store = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.storeId = snapshot.get('id');
          if (this.storeId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.storesService.getStore(this.storeId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.store = res.store as StorePopulated;
          this.rights = res.rights;
          this.storesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteStore() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_STORE',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteStore();
        }
      }
    );
  }
  deleteStore() {
    this.beforeLoadingData();
    this.storesService.deleteStore(this.store)
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
