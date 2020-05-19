import { NgModule } from '@angular/core';
import { SystemAdminRoutingModule } from './system-admin-routing.module';
import { SystemAdminComponent } from './system-admin.component';

const modules = [
  SystemAdminRoutingModule,
];

const declarations = [
  SystemAdminComponent,
];


@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...declarations,
  ],

})
export class SystemAdminModule { }
