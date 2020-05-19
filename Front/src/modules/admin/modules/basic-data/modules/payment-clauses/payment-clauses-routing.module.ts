// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { PaymentClausesComponent } from './payment-clauses.component';
import { EditPaymentClauseComponent, ShowPaymentClauseComponent } from './components';


const routes: Routes = [
  { path: '', component: PaymentClausesComponent },
  { path: 'add', component: EditPaymentClauseComponent },
  { path: 'edit/:id', component: EditPaymentClauseComponent },
  { path: ':id', component: ShowPaymentClauseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentClausesRoutingModule { }
