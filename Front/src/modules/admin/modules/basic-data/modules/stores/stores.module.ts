import { NgModule } from '@angular/core';

import { StoresComponent } from './stores.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { StoresRoutingModule } from './stores-routing.module';
import { ListStoreComponent, ShowStoreComponent, EditStoreComponent } from './components';
import { StoresService } from './services';


const modules = [
  SharedModule,
  StoresRoutingModule
];

const declarations = [
  StoresComponent,
  ListStoreComponent,
  ShowStoreComponent,
  EditStoreComponent,
];

const services = [
  StoresService
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
export class StoresModule { }
