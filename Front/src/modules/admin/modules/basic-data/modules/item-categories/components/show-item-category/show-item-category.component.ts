import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { ItemCategoriesService } from '../../services';
import { ItemCategory } from '../../models/item-category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'acc-show-item-category',
  templateUrl: './show-item-category.component.html',
  styleUrls: ['./show-item-category.component.scss']
})
export class ShowItemCategoryComponent extends SmartComponent implements OnInit, OnDestroy {

  itemCategory: ItemCategory;
  rights: {[key: string]: boolean};
  itemCategoryId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private itemCategoriesService: ItemCategoriesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.itemCategory = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.itemCategoryId = snapshot.get('id');
          if (this.itemCategoryId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.itemCategoriesService.getItemCategory(this.itemCategoryId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.itemCategory = res.itemCategory;
          this.rights = res.rights;
          this.itemCategoriesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteItemCategory() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ITEM_CATEGORY',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteItemCategory();
        }
      }
    );
  }
  deleteItemCategory() {
    this.beforeLoadingData();
    this.itemCategoriesService.deleteItemCategory(this.itemCategory)
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
