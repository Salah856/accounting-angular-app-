import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface Company extends CrudData {
  _id ?: string;
  name ?: string;
  imageUrl?: string;
  image?: File;
}

export interface CompanyListResponse extends GeneralResponse {
  companies: Company[];
  count: number;
}

export interface CompanyResponse extends GeneralResponse {
  company: Company;
}
