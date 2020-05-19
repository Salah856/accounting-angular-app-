import { GeneralResponse } from 'src/modules/shared/models';

export interface LoginResponse extends GeneralResponse {
  token: string;
  username: string;
  imageUrl: string;
}
