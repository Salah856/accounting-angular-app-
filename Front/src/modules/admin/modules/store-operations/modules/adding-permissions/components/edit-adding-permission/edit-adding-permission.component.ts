import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { AddingPermission, AddingPermissionOptions, AddedItem, AddedItemPopulated } from '../../models/adding-permission.model';
import { AddingPermissionsService } from '../../services/adding-permissions.service';


import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';


@Component({
  selector: 'acc-edit-adding-permission',
  templateUrl: './edit-adding-permission.component.html',
  styleUrls: ['./edit-adding-permission.component.scss']
})
export class EditAddingPermissionComponent extends SmartComponent implements OnInit, OnDestroy {
  addingPermission: AddingPermission;
  addingPermissionId: string;
  addingPermissionOptions: AddingPermissionOptions;
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
    private addingPermissionsService: AddingPermissionsService,
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
    this.addingPermission = {};
    this.addingPermissionOptions = {};
    this.toBeAddedItem = {};
    this.addedItemsPopulated = [];
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.addingPermissionId = snapshot.get('id');
          this.loadData();

        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    const requests: Observable<any>[] = [
      this.addingPermissionsService.getOptions()
    ];
    if (this.addingPermissionId) {
      requests.push(
        this.addingPermissionsService.getAddingPermission(this.addingPermissionId)
      );
    }
    forkJoin(requests)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.addingPermissionOptions = res[0].options;
          if (this.addingPermissionId) {
            this.addingPermission = res[1].addingPermission as AddingPermission;
            this.addedItemsPopulated = this.addingPermission.addedItems.map(addedItem => ({
              item: this.addingPermissionOptions.items.find(item => item._id === addedItem.item),
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
    this.addingPermission = {
      ...this.addingPermission,
      date: this.addingPermission.date ? moment(this.addingPermission.date).toISOString() : null,
      addedItems: this.addedItemsPopulated.map(addedItem => ({
        item: addedItem.item._id,
        quantity: addedItem.quantity
      })),
    };

    let request = this.addingPermissionsService.addAddingPermission(this.addingPermission);
    if (this.addingPermissionId) {
      request = this.addingPermissionsService.editAddingPermission(this.addingPermission);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.addingPermissionId) {
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
      item: this.addingPermissionOptions.items.find(item => item._id === this.toBeAddedItem.item),
      quantity: this.toBeAddedItem.quantity
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
