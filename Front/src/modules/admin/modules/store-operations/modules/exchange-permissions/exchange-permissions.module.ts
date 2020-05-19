import { NgModule } from '@angular/core';

import { ExchangePermissionsComponent } from './exchange-permissions.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ExchangePermissionsRoutingModule } from './exchange-permissions-routing.module';
import { ListExchangePermissionComponent, ShowExchangePermissionComponent, EditExchangePermissionComponent } from './components';
import { ExchangePermissionsService } from './services';


const modules = [
  SharedModule,
  ExchangePermissionsRoutingModule
];

const declarations = [
  ExchangePermissionsComponent,
  ListExchangePermissionComponent,
  ShowExchangePermissionComponent,
  EditExchangePermissionComponent,
];

const services = [
  ExchangePermissionsService
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
export class ExchangePermissionsModule { }
