import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface ItemCategory extends CrudData {
  _id ?: string;
  name ?: string;
}

export interface ItemCategoryListResponse extends GeneralResponse {
  itemCategories: ItemCategory[];
  count: number;
}

export interface ItemCategoryResponse extends GeneralResponse {
  itemCategory: ItemCategory;
}
