import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ItemsService } from '../../services';
import { Item, ItemPopulated } from '../../models/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';


@Component({
  selector: 'acc-show-item',
  templateUrl: './show-item.component.html',
  styleUrls: ['./show-item.component.scss']
})
export class ShowItemComponent extends SmartComponent implements OnInit, OnDestroy {

  item: ItemPopulated;
  rights: {[key: string]: boolean};
  itemId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private itemsService: ItemsService,
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
    this.item = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.itemId = snapshot.get('id');
          if (this.itemId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.itemsService.getItem(this.itemId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.item = res.item as ItemPopulated;
          this.rights = res.rights;
          this.itemsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteItem() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ITEM',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteItem();
        }
      }
    );
  }
  deleteItem() {
    this.beforeLoadingData();
    this.itemsService.deleteItem(this.item)
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
