// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ExchangePermissionsComponent } from './exchange-permissions.component';
import { EditExchangePermissionComponent, ShowExchangePermissionComponent } from './components';


const routes: Routes = [
  { path: '', component: ExchangePermissionsComponent },
  { path: 'add', component: EditExchangePermissionComponent },
  { path: 'edit/:id', component: EditExchangePermissionComponent },
  { path: ':id', component: ShowExchangePermissionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangePermissionsRoutingModule { }
