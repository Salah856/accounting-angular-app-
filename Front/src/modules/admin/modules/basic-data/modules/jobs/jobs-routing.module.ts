// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { JobsComponent } from './jobs.component';
import { EditJobComponent, ShowJobComponent } from './components';


const routes: Routes = [
  { path: '', component: JobsComponent },
  { path: 'add', component: EditJobComponent },
  { path: 'edit/:id', component: EditJobComponent },
  { path: ':id', component: ShowJobComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
