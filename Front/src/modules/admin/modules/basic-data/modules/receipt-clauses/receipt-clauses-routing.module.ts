// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ReceiptClausesComponent } from './receipt-clauses.component';
import { EditReceiptClauseComponent, ShowReceiptClauseComponent } from './components';


const routes: Routes = [
  { path: '', component: ReceiptClausesComponent },
  { path: 'add', component: EditReceiptClauseComponent },
  { path: 'edit/:id', component: EditReceiptClauseComponent },
  { path: ':id', component: ShowReceiptClauseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptClausesRoutingModule { }
