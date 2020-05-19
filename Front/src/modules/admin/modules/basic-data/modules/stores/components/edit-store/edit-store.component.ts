import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { Store } from '../../models/store.model';
import { StoresService } from '../../services/stores.service';

import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

import * as moment from 'moment';


@Component({
  selector: 'acc-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent extends SmartComponent implements OnInit, OnDestroy {
  store: Store;
  storeId: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];

  constructor(
    private route: ActivatedRoute,
    private storesService: StoresService,
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
    this.store = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.storeId = snapshot.get('id');
          if (this.storeId) {
            this.loadData();
          }
        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    this.storesService.getStore(this.storeId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.store = res.store as Store;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    this.store = {
      ...this.store,
      createdAt: this.store.createdAt ? moment(this.store.createdAt).toISOString() : null,
    };

    let request = this.storesService.addStore(this.store);
    if (this.storeId) {
      request = this.storesService.editStore(this.store);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.storeId) {
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

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.store.phoneNumbers) {
        this.store.phoneNumbers = [];
      }
      this.store.phoneNumbers = [...this.store.phoneNumbers, value.trim()];
    }
    if (input) {
      input.value = '';
    }
  }

  remove(phoneNumber: string): void {
    const index = this.store.phoneNumbers.indexOf(phoneNumber);
    if (index >= 0) {
      this.store.phoneNumbers = [
        ...this.store.phoneNumbers.slice(0, index),
        ...this.store.phoneNumbers.slice(index + 1)
      ];
    }
  }
}
