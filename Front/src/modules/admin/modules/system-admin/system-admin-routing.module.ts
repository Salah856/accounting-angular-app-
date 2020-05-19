// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { SystemAdminComponent } from './system-admin.component';

const routes: Routes = [
  {
    path: '',
    component: SystemAdminComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'users',
      //   pathMatch: 'full'
      // },
      {
        path: 'users',
        loadChildren: 'src/modules/admin/modules/system-admin/modules/users/users.module#UsersModule'
      },
      {
        path: 'foundations',
        loadChildren: 'src/modules/admin/modules/system-admin/modules/foundations/foundations.module#FoundationsModule'
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemAdminRoutingModule { }
