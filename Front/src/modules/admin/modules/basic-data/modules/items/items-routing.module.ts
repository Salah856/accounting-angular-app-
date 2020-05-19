// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ItemsComponent } from './items.component';
import { EditItemComponent, ShowItemComponent } from './components';


const routes: Routes = [
  { path: '', component: ItemsComponent },
  { path: 'add', component: EditItemComponent },
  { path: 'edit/:id', component: EditItemComponent },
  { path: ':id', component: ShowItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
