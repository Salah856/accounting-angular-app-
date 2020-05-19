import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { ItemUnit } from '../../models/item-unit.model';
import { ItemUnitsService } from '../../services/item-units.service';

@Component({
  selector: 'acc-edit-item-unit',
  templateUrl: './edit-item-unit.component.html',
  styleUrls: ['./edit-item-unit.component.scss']
})
export class EditItemUnitComponent extends SmartComponent implements OnInit, OnDestroy {
  itemUnit: ItemUnit;
  itemUnitId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemUnitsService: ItemUnitsService,
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
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.itemUnitsService.addItemUnit(this.itemUnit);
    if (this.itemUnitId) {
      request = this.itemUnitsService.editItemUnit(this.itemUnit);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.itemUnitId) {
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
