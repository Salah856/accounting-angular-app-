import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemUnit } from '../../models/item-unit.model';
import { ItemUnitsService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acc-list-item-unit',
  templateUrl: './list-item-unit.component.html',
  styleUrls: ['./list-item-unit.component.scss']
})
export class ListItemUnitComponent extends PagedComponent implements OnInit, OnDestroy {
  itemUnits: ItemUnit[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'ITEM_UNIT_NAME', sortable: true, filter: true },
    { name: 'numberOfItems', label: 'ITEM_UNIT_NUM_ITEMS', sortable: true, filter: true },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private itemUnitsService: ItemUnitsService,
    private toastService: ToastService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
    this.loadData();
  }

  init() {
    this.itemUnits = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.itemUnitsService.getItemUnits({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.itemUnits = data.itemUnits;
          this.rights = data.rights;
          this.itemUnitsService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteItemUnit(itemUnit: ItemUnit, index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_ITEM_UNIT',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteItemUnit(itemUnit, index);
        }
      }
    );
  }
  deleteItemUnit(itemUnit: ItemUnit, index: number) {
    this.beforeLoadingData();
    this.itemUnitsService.deleteItemUnit(itemUnit)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.itemUnits = [
            ...this.itemUnits.slice(0, index),
            ...this.itemUnits.slice(index + 1)
          ];
          this.toastService
            .showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onPage(pageEvent: PageEvent) {
    super.onPage(pageEvent);
    this.loadData();
  }
  onRowClick(event: RowClickEvent) {
    this.router.navigate(['./', event.item._id], { relativeTo: this.route });
  }

  onSort(event: Sort) {
    if (event.direction) {
      this.sortField = event.active;
      this.sortDirection = event.direction;
    } else {
      this.sortField = null;
      this.sortDirection = null;
    }
    this.loadData();
  }
  ngOnDestroy() {
    this.onDestroy();
  }
}
