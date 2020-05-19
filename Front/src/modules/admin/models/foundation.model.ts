import { GeneralResponse } from 'src/modules/shared/models';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { Filters } from 'src/modules/shared/models/filters-model';

export interface FoundationBase extends CrudData {
  _id?: string;
  arName?: string;
  enName?: string;
  childrenCount?: number;
  parentTotalId?: string;
}
export interface Foundation extends FoundationBase {
  parent?: string;
  active?: boolean;
}
export interface FoundationPopulated extends FoundationBase {
  active?: Flag;
  parent?: Foundation;
}

export interface FoundationListResponse extends GeneralResponse {
  foundations: Foundation[];
  count: number;
}

export interface FoundationListPopulatedResponse extends GeneralResponse {
  foundations: FoundationPopulated[];
  count: number;
}

export interface FoundationResponse extends GeneralResponse {
  foundation: Foundation;
}

export interface FoundationPopulatedResponse extends GeneralResponse {
  foundation: FoundationPopulated;
}

export interface FoundationFilters extends Filters {
  parent?: string;
}
