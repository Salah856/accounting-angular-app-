import { NgModule } from '@angular/core';

import { ExchangeRequestsComponent } from './exchange-requests.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ExchangeRequestsRoutingModule } from './exchange-requests-routing.module';
import { ListExchangeRequestComponent, ShowExchangeRequestComponent, EditExchangeRequestComponent } from './components';
import { ExchangeRequestsService } from './services';


const modules = [
  SharedModule,
  ExchangeRequestsRoutingModule
];

const declarations = [
  ExchangeRequestsComponent,
  ListExchangeRequestComponent,
  ShowExchangeRequestComponent,
  EditExchangeRequestComponent,
];

const services = [
  ExchangeRequestsService
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
export class ExchangeRequestsModule { }
