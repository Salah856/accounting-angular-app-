// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { AddingPermissionsComponent } from './adding-permissions.component';
import { EditAddingPermissionComponent, ShowAddingPermissionComponent } from './components';


const routes: Routes = [
  { path: '', component: AddingPermissionsComponent },
  { path: 'add', component: EditAddingPermissionComponent },
  { path: 'edit/:id', component: EditAddingPermissionComponent },
  { path: ':id', component: ShowAddingPermissionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddingPermissionsRoutingModule { }
