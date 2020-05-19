// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { AddingRequestsComponent } from './adding-requests.component';
import { EditAddingRequestComponent, ShowAddingRequestComponent } from './components';


const routes: Routes = [
  { path: '', component: AddingRequestsComponent },
  { path: 'add', component: EditAddingRequestComponent },
  { path: 'edit/:id', component: EditAddingRequestComponent },
  { path: ':id', component: ShowAddingRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddingRequestsRoutingModule { }
