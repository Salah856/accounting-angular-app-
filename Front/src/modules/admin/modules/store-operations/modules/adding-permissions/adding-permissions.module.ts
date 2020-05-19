import { NgModule } from '@angular/core';

import { AddingPermissionsComponent } from './adding-permissions.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { AddingPermissionsRoutingModule } from './adding-permissions-routing.module';
import { ListAddingPermissionComponent, ShowAddingPermissionComponent, EditAddingPermissionComponent } from './components';
import { AddingPermissionsService } from './services';


const modules = [
  SharedModule,
  AddingPermissionsRoutingModule
];

const declarations = [
  AddingPermissionsComponent,
  ListAddingPermissionComponent,
  ShowAddingPermissionComponent,
  EditAddingPermissionComponent,
];

const services = [
  AddingPermissionsService
];


@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...declarations,
  ],
  providers: [
    ...services
  ],

})
export class AddingPermissionsModule { }
