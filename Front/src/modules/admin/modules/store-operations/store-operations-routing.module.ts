// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { StoreOperationsComponent } from './store-operations.component';

const routes: Routes = [
  {
    path: '',
    component: StoreOperationsComponent,
    children: [
      {
        path: 'addingPermissions',
        loadChildren:
          'src/modules/admin/modules/store-operations/modules/adding-permissions/adding-permissions.module#AddingPermissionsModule'
      },
      {
        path: 'exchangePermissions',
        loadChildren:
          'src/modules/admin/modules/store-operations/modules/exchange-permissions/exchange-permissions.module#ExchangePermissionsModule'
      },
      {
        path: 'addingRequests',
        loadChildren:
          'src/modules/admin/modules/store-operations/modules/adding-requests/adding-requests.module#AddingRequestsModule'
      },
      {
        path: 'exchangeRequests',
        loadChildren:
          'src/modules/admin/modules/store-operations/modules/exchange-requests/exchange-requests.module#ExchangeRequestsModule'
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreOperationsRoutingModule { }
