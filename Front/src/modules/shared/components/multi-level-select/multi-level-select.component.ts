import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from './models/SelectItem';
import { TranslatedComponent } from '../../base-components/translated.component';
import { TranslationService } from '../../services';
import { ServerTranslatePipe } from '../../pipes/server-translate.pipe';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'acc-multi-level-select',
  templateUrl: './multi-level-select.component.html',
  styleUrls: ['./multi-level-select.component.scss']
})
export class MultiLevelSelectComponent extends TranslatedComponent {
  private _data: SelectItem[];
  private previousSelection: boolean;
  @Input()
  set data(selectData: SelectItem[]) {
    this._data = selectData;
    if (this.previousSelection) {
      this.selectedItem = selectData[0];
      this.change.emit(this.selectedItem);

    } else {
      this.selectedItem = {};
    }
  }
  get data(): SelectItem[] {
    return this._data;
  }
  @Input() placeholder: string;
  @Input() required = false;
  @Input() emptyOption = true;
  @Output() getParent: EventEmitter<SelectItem> = new EventEmitter();
  @Output() getChildren: EventEmitter<SelectItem> = new EventEmitter();
  @Output() change: EventEmitter<SelectItem> = new EventEmitter();
  selectedItem: SelectItem;

  onSelectionChange(event: MatSelectChange) {
    this.previousSelection = true;
    this.selectedItem = this.data.find(item => item._id === event.value) || {};
    this.change.emit(this.selectedItem);
  }

  getItemName(item: SelectItem) {
    return `${item.arName}|${item.enName}`;
  }

  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  getItemParent() {
    this.getParent.emit(this.selectedItem);
  }

  getItemChildren() {
    this.getChildren.emit(this.selectedItem);
  }

}
