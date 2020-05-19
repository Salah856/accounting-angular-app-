import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface ItemType extends CrudData {
  _id ?: string;
  name ?: string;
}

export interface ItemTypeListResponse extends GeneralResponse {
  itemTypes: ItemType[];
  count: number;
}

export interface ItemTypeResponse extends GeneralResponse {
  itemType: ItemType;
}
