import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface ItemUnit extends CrudData {
  _id ?: string;
  name ?: string;
  numberOfItems ?: number;
}

export interface ItemUnitListResponse extends GeneralResponse {
  itemUnits: ItemUnit[];
  count: number;
}

export interface ItemUnitResponse extends GeneralResponse {
  itemUnit: ItemUnit;
}
