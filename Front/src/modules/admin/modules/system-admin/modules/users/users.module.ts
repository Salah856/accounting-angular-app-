import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent, ShowUserComponent, EditUserComponent, EditUserRightsComponent } from './components';


const modules = [
  SharedModule,
  UsersRoutingModule
];

const declarations = [
  UsersComponent,
  ListUserComponent,
  ShowUserComponent,
  EditUserComponent,
  EditUserRightsComponent,
];


@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...declarations,
  ],
  providers: [
  ],

})
export class UsersModule { }
