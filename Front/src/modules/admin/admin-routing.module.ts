// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { AdminComponent } from './admin.component';
import { LoginComponent } from './components';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { LoginGuard, HomeGuard } from './guards';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'home',
                component: AdminHomeComponent,
                canActivate: [HomeGuard],
                children: [
                  // {
                  //   path: '',
                  //   redirectTo: 'basicData',
                  //   pathMatch: 'full',
                  // },
                  {
                    path: 'basicData',
                    loadChildren: 'src/modules/admin/modules/basic-data/basic-data.module#BasicDataModule'
                  },
                  {
                    path: 'systemAdmin',
                    loadChildren: 'src/modules/admin/modules/system-admin/system-admin.module#SystemAdminModule'
                  },
                  {
                    path: 'storeOperations',
                    loadChildren: 'src/modules/admin/modules/store-operations/store-operations.module#StoreOperationsModule'
                  }
                ],
            }
        ]
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }
