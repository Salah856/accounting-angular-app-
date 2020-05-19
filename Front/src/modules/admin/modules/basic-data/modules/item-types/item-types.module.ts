import { NgModule } from '@angular/core';

import { ItemTypesComponent } from './item-types.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ItemTypesRoutingModule } from './item-types-routing.module';
import { ListItemTypeComponent, ShowItemTypeComponent, EditItemTypeComponent } from './components';
import { ItemTypesService } from './services';


const modules = [
  SharedModule,
  ItemTypesRoutingModule
];

const declarations = [
  ItemTypesComponent,
  ListItemTypeComponent,
  ShowItemTypeComponent,
  EditItemTypeComponent,
];

const services = [
  ItemTypesService
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
export class ItemTypesModule { }
