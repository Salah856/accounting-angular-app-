// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { ItemCategoriesComponent } from './item-categories.component';
import { EditItemCategoryComponent, ShowItemCategoryComponent } from './components';


const routes: Routes = [
  { path: '', component: ItemCategoriesComponent },
  { path: 'add', component: EditItemCategoryComponent },
  { path: 'edit/:id', component: EditItemCategoryComponent },
  { path: ':id', component: ShowItemCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemCategoriesRoutingModule { }
