import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ItemTypesService } from '../../services';
import { ItemType } from '../../models/item-type.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'acc-show-item-type',
  templateUrl: './show-item-type.component.html',
  styleUrls: ['./show-item-type.component.scss']
})
export class ShowItemTypeComponent extends SmartComponent implements OnInit, OnDestroy {

  itemType: ItemType;
  rights: {[key: string]: boolean};
  itemTypeId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private itemTypesService: ItemTypesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.itemType = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.itemTypeId = snapshot.get('id');
          if (this.itemTypeId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.itemTypesService.getItemType(this.itemTypeId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.itemType = res.itemType;
          this.rights = res.rights;
          this.itemTypesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteItemType() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ITEM_TYPE',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteItemType();
        }
      }
    );
  }
  deleteItemType() {
    this.beforeLoadingData();
    this.itemTypesService.deleteItemType(this.itemType)
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
