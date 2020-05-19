import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface Job extends CrudData {
  _id ?: string;
  name ?: string;
}

export interface JobListResponse extends GeneralResponse {
  jobs: Job[];
  count: number;
}

export interface JobResponse extends GeneralResponse {
  job: Job;
}
