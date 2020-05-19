// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ItemTypesComponent } from './item-types.component';
import { EditItemTypeComponent, ShowItemTypeComponent } from './components';


const routes: Routes = [
  { path: '', component: ItemTypesComponent },
  { path: 'add', component: EditItemTypeComponent },
  { path: 'edit/:id', component: EditItemTypeComponent },
  { path: ':id', component: ShowItemTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemTypesRoutingModule { }
