import { GeneralResponse } from 'src/modules/shared/models';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

interface PaymentClauseBase extends CrudData {
  _id?: string;
  name?: string;
}
export interface PaymentClause extends PaymentClauseBase {
  constant?: boolean;
}
export interface PaymentClausePopulated extends PaymentClauseBase {
  constant?: Flag;
}

export interface PaymentClauseListResponse extends GeneralResponse {
  paymentClauses: PaymentClausePopulated[];
  count: number;
}

export interface PaymentClausePopulatedResponse extends GeneralResponse {
  paymentClause: PaymentClausePopulated;
}

export interface PaymentClauseResponse extends GeneralResponse {
  paymentClause: PaymentClause;
}
