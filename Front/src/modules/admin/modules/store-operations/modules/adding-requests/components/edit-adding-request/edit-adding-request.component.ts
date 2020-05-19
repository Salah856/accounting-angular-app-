import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { AddingRequest, AddingRequestOptions, AddedItem, AddedItemPopulated } from '../../models/adding-request.model';
import { AddingRequestsService } from '../../services/adding-requests.service';


import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';


@Component({
  selector: 'acc-edit-adding-request',
  templateUrl: './edit-adding-request.component.html',
  styleUrls: ['./edit-adding-request.component.scss']
})
export class EditAddingRequestComponent extends SmartComponent implements OnInit, OnDestroy {
  addingRequest: AddingRequest;
  addingRequestId: string;
  addingRequestOptions: AddingRequestOptions;
  addedItemsPopulated: AddedItemPopulated[];
  toBeAddedItem: AddedItem;
  maxDate = new Date().toISOString();
  columns: TableColumn[] = [
    { name: 'item.name', label: 'ITEM', sortable: false },
    { name: 'quantity', label: 'QUANTITY', sortable: false },
    { name: 'actions', label: 'ACTIONS', sortable: false, customTemplate: true, hideLabelInMobile: true },
  ];

  get addItemQuantityEnabled() {
    return this.toBeAddedItem && this.toBeAddedItem.item
      && this.toBeAddedItem.quantity;
  }
  constructor(
    private route: ActivatedRoute,
    private addingRequestsService: AddingRequestsService,
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
    this.addingRequest = {};
    this.addingRequestOptions = {};
    this.toBeAddedItem = {};
    this.addedItemsPopulated = [];
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.addingRequestId = snapshot.get('id');
          this.loadData();

        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    const requests: Observable<any>[] = [
      this.addingRequestsService.getOptions()
    ];
    if (this.addingRequestId) {
      requests.push(
        this.addingRequestsService.getAddingRequest(this.addingRequestId)
      );
    }
    forkJoin(requests)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.addingRequestOptions = res[0].options;
          if (this.addingRequestId) {
            this.addingRequest = res[1].addingRequest as AddingRequest;
            this.addedItemsPopulated = this.addingRequest.addedItems.map(addedItem => ({
              item: this.addingRequestOptions.items.find(item => item._id === addedItem.item),
              quantity: addedItem.quantity,
            }));
          }
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  validateAddedItem() {
    this.errors = [];
    const addedBefore = this.addedItemsPopulated
      .find(addedItem => addedItem.item._id === this.toBeAddedItem.item);
    if (addedBefore) {
      this.errors.push('لا يمكن اضافة نفس الصنف أكثر من مرة|Can\'t add the same item more than once');
      return false;
    }
    return true;
  }
  validateForm() {
    this.errors = [];
    if (this.addedItemsPopulated.length === 0) {
      this.errors.push('يجب اضافة صنف واحد على الأقل|You have to add at least one item');
      return false;
    }
    return true;
  }
  onSubmit() {
    if (!this.validateForm()) {
      return;
    }
    this.addingRequest = {
      ...this.addingRequest,
      date: this.addingRequest.date ? moment(this.addingRequest.date).toISOString() : null,
      addedItems: this.addedItemsPopulated.map(addedItem => ({
        item: addedItem.item._id,
        quantity: addedItem.quantity
      })),
    };

    let request = this.addingRequestsService.addAddingRequest(this.addingRequest);
    if (this.addingRequestId) {
      request = this.addingRequestsService.editAddingRequest(this.addingRequest);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.addingRequestId) {
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
  removeAddedItem(item: AddedItem, index: number) {
    this.addedItemsPopulated = [
      ...this.addedItemsPopulated.slice(0, index),
      ...this.addedItemsPopulated.slice(index + 1),
    ];
  }

  addItemQuantity() {
    if (!this.validateAddedItem()) {
      return;
    }
    this.addedItemsPopulated.push({
      item: this.addingRequestOptions.items.find(item => item._id === this.toBeAddedItem.item),
      quantity: this.toBeAddedItem.quantity
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
