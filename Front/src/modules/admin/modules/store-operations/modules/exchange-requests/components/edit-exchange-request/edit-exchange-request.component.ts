import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import {
  ExchangeRequest,
  ExchangeRequestOptions,
  ExchangedItem,
  ExchangedItemPopulated
} from '../../models/exchange-request.model';
import { ExchangeRequestsService } from '../../services/exchange-requests.service';


import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';


@Component({
  selector: 'acc-edit-exchange-request',
  templateUrl: './edit-exchange-request.component.html',
  styleUrls: ['./edit-exchange-request.component.scss']
})
export class EditExchangeRequestComponent extends SmartComponent implements OnInit, OnDestroy {
  exchangeRequest: ExchangeRequest;
  exchangeRequestId: string;
  exchangeRequestOptions: ExchangeRequestOptions;
  exchangedItemsPopulated: ExchangedItemPopulated[];
  toBeExchangedItem: ExchangedItem;
  maxDate = new Date().toISOString();
  columns: TableColumn[] = [
    { name: 'item.name', label: 'ITEM', sortable: false },
    { name: 'quantity', label: 'QUANTITY', sortable: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, customTemplate: true, hideLabelInMobile: true },
  ];

  get addItemQuantityEnabled() {
    return this.toBeExchangedItem && this.toBeExchangedItem.item
      && this.toBeExchangedItem.quantity;
  }
  constructor(
    private route: ActivatedRoute,
    private exchangeRequestsService: ExchangeRequestsService,
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
    this.exchangeRequest = {};
    this.exchangeRequestOptions = {};
    this.toBeExchangedItem = {};
    this.exchangedItemsPopulated = [];
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.exchangeRequestId = snapshot.get('id');
          this.loadData();

        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    const requests: Observable<any>[] = [
      this.exchangeRequestsService.getOptions()
    ];
    if (this.exchangeRequestId) {
      requests.push(
        this.exchangeRequestsService.getExchangeRequest(this.exchangeRequestId)
      );
    }
    forkJoin(requests)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.exchangeRequestOptions = res[0].options;
          if (this.exchangeRequestId) {
            this.exchangeRequest = res[1].exchangeRequest as ExchangeRequest;
            this.exchangedItemsPopulated = this.exchangeRequest.exchangedItems.map(exchangedItem => ({
              item: this.exchangeRequestOptions.items.find(item => item._id === exchangedItem.item),
              quantity: exchangedItem.quantity,
            }));
          }
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  validateExchangedItem() {
    this.errors = [];
    const exchangedBefore = this.exchangedItemsPopulated
      .find(exchangedItem => exchangedItem.item._id === this.toBeExchangedItem.item);
    if (exchangedBefore) {
      this.errors.push('لا يمكن اضافة نفس الصنف أكثر من مرة|Can\'t add the same item more than once');
      return false;
    }
    return true;
  }
  validateForm() {
    this.errors = [];
    if (this.exchangedItemsPopulated.length === 0) {
      this.errors.push('يجب اضافة صنف واحد على الأقل|You have to add at least one item');
      return false;
    }
    return true;
  }
  onSubmit() {
    if (!this.validateForm()) {
      return;
    }
    this.exchangeRequest = {
      ...this.exchangeRequest,
      date: this.exchangeRequest.date ? moment(this.exchangeRequest.date).toISOString() : null,
      exchangedItems: this.exchangedItemsPopulated.map(exchangedItem => ({
        item: exchangedItem.item._id,
        quantity: exchangedItem.quantity
      })),
    };

    let request = this.exchangeRequestsService.addExchangeRequest(this.exchangeRequest);
    if (this.exchangeRequestId) {
      request = this.exchangeRequestsService.editExchangeRequest(this.exchangeRequest);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.exchangeRequestId) {
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
  removeExchangedItem(item: ExchangedItem, index: number) {
    this.exchangedItemsPopulated = [
      ...this.exchangedItemsPopulated.slice(0, index),
      ...this.exchangedItemsPopulated.slice(index + 1),
    ];
  }

  addItemQuantity() {
    if (!this.validateExchangedItem()) {
      return;
    }
    this.exchangedItemsPopulated.push({
      item: this.exchangeRequestOptions.items.find(item => item._id === this.toBeExchangedItem.item),
      quantity: this.toBeExchangedItem.quantity
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
