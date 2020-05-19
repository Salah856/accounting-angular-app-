import { NgModule } from '@angular/core';

import { ItemsComponent } from './items.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ItemsRoutingModule } from './items-routing.module';
import { ListItemComponent, ShowItemComponent, EditItemComponent } from './components';
import { ItemsService } from './services';


const modules = [
  SharedModule,
  ItemsRoutingModule
];

const declarations = [
  ItemsComponent,
  ListItemComponent,
  ShowItemComponent,
  EditItemComponent,
];

const services = [
  ItemsService
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
export class ItemsModule { }
