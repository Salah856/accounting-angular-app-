// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { CurrenciesComponent } from './currencies.component';
import { EditCurrencyComponent, ShowCurrencyComponent } from './components';


const routes: Routes = [
  { path: '', component: CurrenciesComponent },
  { path: 'add', component: EditCurrencyComponent },
  { path: 'edit/:id', component: EditCurrencyComponent },
  { path: ':id', component: ShowCurrencyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrenciesRoutingModule { }
