import { NgModule } from '@angular/core';

import { ItemUnitsComponent } from './item-units.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ItemUnitsRoutingModule } from './item-units-routing.module';
import { ListItemUnitComponent, ShowItemUnitComponent, EditItemUnitComponent } from './components';
import { ItemUnitsService } from './services';


const modules = [
  SharedModule,
  ItemUnitsRoutingModule
];

const declarations = [
  ItemUnitsComponent,
  ListItemUnitComponent,
  ShowItemUnitComponent,
  EditItemUnitComponent,
];

const services = [
  ItemUnitsService
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
export class ItemUnitsModule { }
