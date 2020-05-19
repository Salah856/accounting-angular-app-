import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { Item } from 'src/modules/admin/modules/basic-data/modules/items/models/item.model';
import { Store } from 'src/modules/admin/modules/basic-data/modules/stores/models/store.model';

export interface ExchangePermissionOptions {
  stores?: Store[];
  items?: Item[];
}


export interface ExchangedItemBase {
  quantity?: number;
}

export interface ExchangedItem extends ExchangedItemBase {
  item?: string;
}

export interface ExchangedItemPopulated extends ExchangedItemBase {
  item?: Item;
}

export interface ExchangePermissionBase extends CrudData {
  _id?: string;
  date?: Date | string;
  notes?: string;
  storeSecretary?: string;
}
export interface ExchangePermission extends ExchangePermissionBase {
  store?: string;
  exchangedItems?: ExchangedItem[];
}

export interface ExchangePermissionPopulated extends ExchangePermissionBase {
  store?: Store;
  exchangedItems?: ExchangedItemPopulated[];
}

export interface ExchangePermissionOptionsResponse extends GeneralResponse {
  options: ExchangePermissionOptions;
}

export interface ExchangePermissionListResponse extends GeneralResponse {
  exchangePermissions: ExchangePermission[];
  count: number;
}

export interface ExchangePermissionResponse extends GeneralResponse {
  exchangePermission: ExchangePermissionPopulated;
}

export interface ExchangePermissionPopulatedResponse extends GeneralResponse {
  exchangePermission: ExchangePermissionPopulated;
}
