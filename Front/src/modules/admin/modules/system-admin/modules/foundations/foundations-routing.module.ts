// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { FoundationsComponent } from './foundations.component';
import { EditFoundationComponent } from './components';


const routes: Routes = [
  { path: 'add', component: EditFoundationComponent },
  { path: 'edit/:id', component: EditFoundationComponent },
  {
    path: '',
    component: FoundationsComponent,
  },
  {
    path: ':id',
    component: FoundationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoundationsRoutingModule { }
