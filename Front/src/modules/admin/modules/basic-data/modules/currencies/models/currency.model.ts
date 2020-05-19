import { GeneralResponse } from 'src/modules/shared/models';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface Currency extends CrudData {
  _id ?: string;
  name ?: string;
  symbol ?: string;
}

export interface CurrencyListResponse extends GeneralResponse {
  currencies: Currency[];
  count: number;
}

export interface CurrencyResponse extends GeneralResponse {
  currency: Currency;
}
