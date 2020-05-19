import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { Item } from 'src/modules/admin/modules/basic-data/modules/items/models/item.model';
import { Store } from 'src/modules/admin/modules/basic-data/modules/stores/models/store.model';

export interface AddingPermissionOptions {
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

export interface AddingPermissionBase extends CrudData {
  _id?: string;
  date?: Date | string;
  notes?: string;
  storeSecretary?: string;
}
export interface AddingPermission extends AddingPermissionBase {
  store?: string;
  addedItems?: AddedItem[];
}

export interface AddingPermissionPopulated extends AddingPermissionBase {
  store?: Store;
  addedItems?: AddedItemPopulated[];
}

export interface AddingPermissionOptionsResponse extends GeneralResponse {
  options: AddingPermissionOptions;
}

export interface AddingPermissionListResponse extends GeneralResponse {
  addingPermissions: AddingPermission[];
  count: number;
}

export interface AddingPermissionResponse extends GeneralResponse {
  addingPermission: AddingPermissionPopulated;
}

export interface AddingPermissionPopulatedResponse extends GeneralResponse {
  addingPermission: AddingPermissionPopulated;
}
