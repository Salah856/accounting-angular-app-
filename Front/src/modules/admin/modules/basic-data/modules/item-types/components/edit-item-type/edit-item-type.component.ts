import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ItemType } from '../../models/item-type.model';
import { ItemTypesService } from '../../services/item-types.service';

@Component({
  selector: 'acc-edit-item-type',
  templateUrl: './edit-item-type.component.html',
  styleUrls: ['./edit-item-type.component.scss']
})
export class EditItemTypeComponent extends SmartComponent implements OnInit, OnDestroy {
  itemType: ItemType;
  itemTypeId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemTypesService: ItemTypesService,
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
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.itemTypesService.addItemType(this.itemType);
    if (this.itemTypeId) {
      request = this.itemTypesService.editItemType(this.itemType);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.itemTypeId) {
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
