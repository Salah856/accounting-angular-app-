import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ItemCategory } from '../../models/item-category.model';
import { ItemCategoriesService } from '../../services/item-categories.service';

@Component({
  selector: 'acc-edit-item-category',
  templateUrl: './edit-item-category.component.html',
  styleUrls: ['./edit-item-category.component.scss']
})
export class EditItemCategoryComponent extends SmartComponent implements OnInit, OnDestroy {
  itemCategory: ItemCategory;
  itemCategoryId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemCategoriesService: ItemCategoriesService,
    private toastService: ToastService,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
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
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.itemCategoriesService.addItemCategory(this.itemCategory);
    if (this.itemCategoryId) {
      request = this.itemCategoriesService.editItemCategory(this.itemCategory);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.itemCategoryId) {
          this.router.navigate(['../../'], { relativeTo: this.route });
        } else {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
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
