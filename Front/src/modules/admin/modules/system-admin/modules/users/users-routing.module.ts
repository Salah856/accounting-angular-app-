// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { UsersComponent } from './users.component';
import { EditUserComponent, ShowUserComponent, EditUserRightsComponent } from './components';


const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'add', component: EditUserComponent },
  { path: 'edit/:id', component: EditUserComponent },
  { path: 'rights/edit/:id', component: EditUserRightsComponent },
  { path: ':id', component: ShowUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
