import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { Item } from 'src/modules/admin/modules/basic-data/modules/items/models/item.model';
import { Store } from 'src/modules/admin/modules/basic-data/modules/stores/models/store.model';

export interface AddingRequestOptions {
  stores?: Store[];
  items?: Item[];
}


export interface AddedItemBase {
  quantity?: number;
}

export interface AddedItem extends AddedItemBase {
  item?: string;
}

export interface AddedItemPopulated extends AddedItemBase {
  item?: Item;
}

export interface AddingRequestBase extends CrudData {
  _id?: string;
  date?: Date | string;
  notes?: string;
  storeSecretary?: string;
}
export interface AddingRequest extends AddingRequestBase {
  store?: string;
  addedItems?: AddedItem[];
}

export interface AddingRequestPopulated extends AddingRequestBase {
  store?: Store;
  addedItems?: AddedItemPopulated[];
}

export interface AddingRequestOptionsResponse extends GeneralResponse {
  options: AddingRequestOptions;
}

export interface AddingRequestListResponse extends GeneralResponse {
  addingRequests: AddingRequest[];
  count: number;
}

export interface AddingRequestResponse extends GeneralResponse {
  addingRequest: AddingRequestPopulated;
}

export interface AddingRequestPopulatedResponse extends GeneralResponse {
  addingRequest: AddingRequestPopulated;
}
