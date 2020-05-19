import { GeneralResponse } from 'src/modules/shared/models';
import { Currency } from '../../currencies/models/currency.model';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

interface TreasuryBase extends CrudData {
  _id?: string;
  name?: string;
  createdAt?: Date | string;
  openingBalance?: number;
  currentBalance?: number;
}
export interface TreasuryPopulated extends TreasuryBase {
  active?: Flag;
  currency?: Currency;
}
export interface Treasury extends TreasuryBase {
  active?: boolean;
  currency?: string;
}

export interface TreasuryOptions {
  currencies: Currency[];
  count: number;
}

export interface TreasuryListResponse extends GeneralResponse {
  treasuries: TreasuryPopulated[];
  count: number;
}

export interface TreasuryResponse extends GeneralResponse {
  treasury: Treasury;
}

export interface TreasuryPopulatedResponse extends GeneralResponse {
  treasury: TreasuryPopulated;
}

export interface TreasuryOptionsResponse extends GeneralResponse {
  options: TreasuryOptions;
}
