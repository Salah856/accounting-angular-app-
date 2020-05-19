import { NgModule } from '@angular/core';

import { ReceiptClausesComponent } from './receipt-clauses.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ReceiptClausesRoutingModule } from './receipt-clauses-routing.module';
import { ListReceiptClauseComponent, ShowReceiptClauseComponent, EditReceiptClauseComponent } from './components';
import { ReceiptClausesService } from './services';


const modules = [
  SharedModule,
  ReceiptClausesRoutingModule
];

const declarations = [
  ReceiptClausesComponent,
  ListReceiptClauseComponent,
  ShowReceiptClauseComponent,
  EditReceiptClauseComponent,
];

const services = [
  ReceiptClausesService
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
export class ReceiptClausesModule { }
