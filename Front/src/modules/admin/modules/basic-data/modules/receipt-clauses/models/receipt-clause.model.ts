import { GeneralResponse } from 'src/modules/shared/models';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';

interface ReceiptClauseBase extends CrudData {
  _id?: string;
  name?: string;
}
export interface ReceiptClause extends ReceiptClauseBase {
  constant?: boolean;
}
export interface ReceiptClausePopulated extends ReceiptClauseBase {
  constant?: Flag;
}
export interface ReceiptClauseListResponse extends GeneralResponse {
  receiptClauses: ReceiptClausePopulated[];
  count: number;
}
export interface ReceiptClausePopulatedResponse extends GeneralResponse {
  receiptClause: ReceiptClausePopulated;
}

export interface ReceiptClauseResponse extends GeneralResponse {
  receiptClause: ReceiptClause;
}
