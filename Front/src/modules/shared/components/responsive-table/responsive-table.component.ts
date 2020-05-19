import {
  Component,
  OnInit,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  TemplateRef,
  QueryList,
} from '@angular/core';
import { Sort } from '@angular/material/sort';

import { TableColumn } from './models/table-column.model';
import { listItemAnimation } from './animation/list-item.animation';
import { RowClickEvent } from './models/row-click-event.model';

@Component({
  selector: 'acc-responsive-table',
  templateUrl: './responsive-table.component.html',
  styleUrls: ['./responsive-table.component.scss'],
  animations: [listItemAnimation]
})

export class ResponsiveTableComponent implements OnInit, AfterContentInit {
  @Input() sortDisabled: boolean;
  @Input() checkable: boolean;
  @Input() selectColumns = false;
  @Input() striped = true;
  @Input() clickable = true;
  @Input() layout = 'responsive';
  @Input() translate = false;
  @Input() lang: string;
  @Input() lockColumnChanges = false;
  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() check: EventEmitter<any> = new EventEmitter();
  @Output() rowClick: EventEmitter<RowClickEvent> = new EventEmitter();
  @ContentChildren('column', { descendants: false }) columnTemplateList: QueryList<TemplateRef<any>>;
  private _data;
  private _columns: TableColumn[];
  shownColumns: number;

  @Input()
  set columns(value) {
    this._columns = value;
    this.shownColumns = this._columns.length;
    let customIdx = 0;
    this._columns.forEach((item, idx) => {
      if (item.customTemplate) {
        this.customColumnMap[idx] = customIdx;
        customIdx++;
      }
      if (item.hide) {
        this.shownColumns--;
      }
    });

    if (this.shownColumns < 3 && this._columns.length > 2) {
      this._columns[0].hide = false;
      this._columns[1].hide = false;
      this._columns[2].hide = false;
    }
  }

  get columns() {
    return this._columns;
  }

  @Input()
  set data(value) {
    this._data = value;
    if (this._data) {
      this.setDisplayedData();
    }
  }

  get data() {
    return this._data;
  }

  displayedData: any[];
  columnTemplates: TemplateRef<any>[];
  customColumnMap: any = {};
  allChecked = false;
  checkValues = new Set();
  constructor() { }

  ngOnInit(): void {

  }

  getItemValue(item: any, key: string) {
    const keyParts = key.split('.');
    let itemValue = item;
    keyParts.forEach((part) => {
      itemValue = itemValue[part]
    });
    return itemValue;
  }

  onSortBtnClick(column: TableColumn, direction) {
    const sortEvent: Sort = { active: column.name, direction: direction };
    this.onSort(sortEvent);
  }

  toggleAll(event) {
    if (this.allChecked) {
      this.displayedData.forEach(item => this.checkValues.add(item));
    } else {
      this.checkValues.clear();
    }

    this.emitCheckEvent();
  }

  ngAfterContentInit() {
    this.columnTemplates = this.columnTemplateList.toArray();
    if (!this.lockColumnChanges) {
      this.columnTemplateList.changes.subscribe(
        () => {
          this.columnTemplates = this.columnTemplateList.toArray();
        }
      );
    }
  }

  onSort(sortEvent: Sort) {
    this.sort.emit(sortEvent);
  }

  onRowClick(item: any, rowIdx: number) {
    if (this.clickable) {
      this.rowClick.emit({ item, rowIdx });
    }
  }

  setDisplayedData() {
    this.displayedData = this._data;
  }

  onCheckChange(item) {
    this.allChecked = false;

    if (this.checkValues.has(item)) {
      this.checkValues.delete(item);
    } else {
      this.checkValues.add(item);
    }

    this.emitCheckEvent();
  }

  emitCheckEvent() {
    this.check.emit(Array.from(this.checkValues));
  }

  toggleColumn(column: TableColumn) {
    if (column.hide) {
      this.shownColumns++;
    } else {
      this.shownColumns--;
    }
    column.hide = !column.hide;
  }
}
