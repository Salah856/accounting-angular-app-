// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ExchangeRequestsComponent } from './exchange-requests.component';
import { EditExchangeRequestComponent, ShowExchangeRequestComponent } from './components';


const routes: Routes = [
  { path: '', component: ExchangeRequestsComponent },
  { path: 'add', component: EditExchangeRequestComponent },
  { path: 'edit/:id', component: EditExchangeRequestComponent },
  { path: ':id', component: ShowExchangeRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRequestsRoutingModule { }
