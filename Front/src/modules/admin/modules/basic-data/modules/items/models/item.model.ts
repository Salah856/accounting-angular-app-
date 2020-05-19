import { GeneralResponse } from 'src/modules/shared/models';
import { Currency } from '../../currencies/models/currency.model';
import { Company } from '../../companies/models/company.model';
import { ItemCategory } from '../../item-categories/models/item-category.model';
import { ItemUnit } from '../../item-units/models/item-unit.model';
import { ItemType } from '../../item-types/models/item-type.model';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

interface ItemBase extends CrudData {
  _id?: string;
  name?: string;
  barcode?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  wholesalePrice?: number;
  defectivePrice?: number;
}
export interface Item extends ItemBase {
  active?: boolean;
  currency?: string;
  unit?: string;
  category?: string;
  type?: string;
  company?: string;
}

export interface ItemPopulated extends ItemBase {
  active?: Flag;
  currency?: Currency;
  unit?: ItemUnit;
  category?: ItemCategory;
  type?: ItemType;
  company?: Company;
}

export interface ItemOptions {
  currencies: Currency[];
  companies: Company[];
  itemCategories: ItemCategory[];
  itemUnits: ItemUnit[];
  itemTypes: ItemType[];
}

export interface ItemListResponse extends GeneralResponse {
  items: ItemPopulated[];
  count: number;
}

export interface ItemResponse extends GeneralResponse {
  item: Item;
}

export interface ItemPopulatedResponse extends GeneralResponse {
  item: ItemPopulated;
}

export interface ItemOptionsResponse extends GeneralResponse {
  options: ItemOptions;
}
