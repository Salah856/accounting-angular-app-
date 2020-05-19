import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ItemUnitsService } from '../../services';
import { ItemUnit } from '../../models/item-unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'acc-show-item-unit',
  templateUrl: './show-item-unit.component.html',
  styleUrls: ['./show-item-unit.component.scss']
})
export class ShowItemUnitComponent extends SmartComponent implements OnInit, OnDestroy {

  itemUnit: ItemUnit;
  rights: {[key: string]: boolean};
  itemUnitId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private itemUnitsService: ItemUnitsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.itemUnit = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.itemUnitId = snapshot.get('id');
          if (this.itemUnitId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.itemUnitsService.getItemUnit(this.itemUnitId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.itemUnit = res.itemUnit;
          this.rights = res.rights;
          this.itemUnitsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteItemUnit() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ITEM_UNIT',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteItemUnit();
        }
      }
    );
  }
  deleteItemUnit() {
    this.beforeLoadingData();
    this.itemUnitsService.deleteItemUnit(this.itemUnit)
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
