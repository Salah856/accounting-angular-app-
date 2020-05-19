// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ItemUnitsComponent } from './item-units.component';
import { EditItemUnitComponent, ShowItemUnitComponent } from './components';


const routes: Routes = [
  { path: '', component: ItemUnitsComponent },
  { path: 'add', component: EditItemUnitComponent },
  { path: 'edit/:id', component: EditItemUnitComponent },
  { path: ':id', component: ShowItemUnitComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemUnitsRoutingModule { }
