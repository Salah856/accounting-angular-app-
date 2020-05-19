import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { Filters } from 'src/modules/shared/models/filters-model';
import { Right } from './right.model';

export interface AppBase extends CrudData {
  _id?: string;
  arName?: string;
  enName?: string;
  route?: string;
  children?: AppBase[];
  childrenCount?: number;
  parentTotalId?: string;
  scopeRequired?: boolean;
}
export interface App extends AppBase {
  parent?: string;
  rights?: string[];
}
export interface AppPopulated extends AppBase {
  parent?: App;
  rights?: Right[];
}

export interface AppListResponse extends GeneralResponse {
  apps: App[];
}


export interface AppResponse extends GeneralResponse {
  app: App;
}

export interface AppPopulatedResponse extends GeneralResponse {
  app: AppPopulated;
}

export interface AppFilters extends Filters {
  parent?: string;
  all?: string;
}
