import { CrudData } from 'src/modules/shared/models/crud-data.model';

export interface Right extends CrudData {
  _id?: string;
  name?: string;
}
