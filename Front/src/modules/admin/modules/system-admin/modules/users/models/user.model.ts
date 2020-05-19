import { GeneralResponse } from 'src/modules/shared/models';
import { Flag } from 'src/modules/shared/models/flag.model';
import { CrudData } from 'src/modules/shared/models/crud-data.model';
import { App, Foundation, Right } from 'src/modules/admin/models';

export interface UserRight {
  app?: string;
  scope?: string;
  rights?: string[];
}

export interface UserRightPopulated {
  app?: App;
  scope?: Foundation;
  rights?: Right[];
}

export interface UserRightOptions {
  apps?: App[];
  rights?: Right[];
  foundations?: Foundation[];
}

export interface UserBase extends CrudData {
  _id?: string;
  name?: string;
  username?: string;
  password?: string;
  phoneNumbers?: string[];
  email?: string;
  imageUrl?: string;
  image?: File;
}
export interface User extends UserBase {
  active?: boolean;
  userRights?: UserRight[];
}
export interface UserPopulated extends UserBase {
  active?: Flag;
  userRights?: UserRightPopulated[];
}

export interface UserListResponse extends GeneralResponse {
  users: UserPopulated[];
  count: number;
}

export interface UserResponse extends GeneralResponse {
  user: User;
}

export interface UserPopulatedResponse extends GeneralResponse {
  user: UserPopulated;
}

export interface UserRightsOptionsResponse extends GeneralResponse {
  options: UserRightOptions;
}

export interface UserAppsListResponse extends GeneralResponse {
  userApps: App[];
}
