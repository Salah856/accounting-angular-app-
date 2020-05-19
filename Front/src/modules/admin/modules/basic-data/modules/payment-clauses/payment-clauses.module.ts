import { NgModule } from '@angular/core';

import { PaymentClausesComponent } from './payment-clauses.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { PaymentClausesRoutingModule } from './payment-clauses-routing.module';
import { ListPaymentClauseComponent, ShowPaymentClauseComponent, EditPaymentClauseComponent } from './components';
import { PaymentClausesService } from './services';


const modules = [
  SharedModule,
  PaymentClausesRoutingModule
];

const declarations = [
  PaymentClausesComponent,
  ListPaymentClauseComponent,
  ShowPaymentClauseComponent,
  EditPaymentClauseComponent,
];

const services = [
  PaymentClausesService
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
export class PaymentClausesModule { }
