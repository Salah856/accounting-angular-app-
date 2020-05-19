import { GeneralResponse } from 'src/modules/shared/models';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface StoreBase extends CrudData {
  _id?: string;
  name?: string;
  createdAt?: Date | string;
  phoneNumbers?: string[];
  email?: string;
  fax?: string;
  address?: string;
  website?: string;
}
export interface Store extends StoreBase {
  active?: boolean;
}
export interface StorePopulated extends StoreBase {
  active?: Flag;
}

export interface StoreListResponse extends GeneralResponse {
  stores: StorePopulated[];
  count: number;
}

export interface StoreResponse extends GeneralResponse {
  store: Store;
}

export interface StorePopulatedResponse extends GeneralResponse {
  store: StorePopulated;
}
