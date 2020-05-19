import { NgModule } from '@angular/core';

import { ItemCategoriesComponent } from './item-categories.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ItemCategoriesRoutingModule } from './item-categories-routing.module';
import { ListItemCategoryComponent, ShowItemCategoryComponent, EditItemCategoryComponent } from './components';
import { ItemCategoriesService } from './services';


const modules = [
  SharedModule,
  ItemCategoriesRoutingModule
];

const declarations = [
  ItemCategoriesComponent,
  ListItemCategoryComponent,
  ShowItemCategoryComponent,
  EditItemCategoryComponent,
];

const services = [
  ItemCategoriesService
];


@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...declarations,
  ],
  providers: [
    ...services
  ],

})
export class ItemCategoriesModule { }
