import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { Item } from 'src/modules/admin/modules/basic-data/modules/items/models/item.model';
import { Store } from 'src/modules/admin/modules/basic-data/modules/stores/models/store.model';

export interface ExchangeRequestOptions {
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

export interface ExchangeRequestBase extends CrudData {
  _id?: string;
  date?: Date | string;
  notes?: string;
  storeSecretary?: string;
}
export interface ExchangeRequest extends ExchangeRequestBase {
  store?: string;
  exchangedItems?: ExchangedItem[];
}

export interface ExchangeRequestPopulated extends ExchangeRequestBase {
  store?: Store;
  exchangedItems?: ExchangedItemPopulated[];
}

export interface ExchangeRequestOptionsResponse extends GeneralResponse {
  options: ExchangeRequestOptions;
}

export interface ExchangeRequestListResponse extends GeneralResponse {
  exchangeRequests: ExchangeRequest[];
  count: number;
}

export interface ExchangeRequestResponse extends GeneralResponse {
  exchangeRequest: ExchangeRequestPopulated;
}

export interface ExchangeRequestPopulatedResponse extends GeneralResponse {
  exchangeRequest: ExchangeRequestPopulated;
}
