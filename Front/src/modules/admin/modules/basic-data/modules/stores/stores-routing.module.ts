// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { StoresComponent } from './stores.component';
import { EditStoreComponent, ShowStoreComponent } from './components';


const routes: Routes = [
  { path: '', component: StoresComponent },
  { path: 'add', component: EditStoreComponent },
  { path: 'edit/:id', component: EditStoreComponent },
  { path: ':id', component: ShowStoreComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule { }
