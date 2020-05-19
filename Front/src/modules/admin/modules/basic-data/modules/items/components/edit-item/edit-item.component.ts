import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { Item, ItemOptions } from '../../models/item.model';
import { ItemsService } from '../../services/items.service';

import { Observable, forkJoin } from 'rxjs';


@Component({
  selector: 'acc-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent extends SmartComponent implements OnInit, OnDestroy {
  item: Item;
  itemId: string;
  itemOptions: ItemOptions;
  maxDate = new Date().toISOString();
  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private toastService: ToastService,
    private router: Router,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
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
          this.loadData();
        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    const requests: Observable<any>[] = [
      this.itemsService.getOptions()
    ];
    if (this.itemId) {
      requests.push(
        this.itemsService.getItem(this.itemId)
      );
    }
    forkJoin(requests)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.itemOptions = res[0].options;
          if (this.itemId) {
            this.item = res[1].item;
          }
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.itemsService.addItem(this.item);
    if (this.itemId) {
      request = this.itemsService.editItem(this.item);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.itemId) {
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
