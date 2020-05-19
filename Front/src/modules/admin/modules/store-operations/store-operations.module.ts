import { NgModule } from '@angular/core';
import { StoreOperationsRoutingModule  } from './store-operations-routing.module';
import { StoreOperationsComponent } from './store-operations.component';

const modules = [
  StoreOperationsRoutingModule,
];

const declarations = [
  StoreOperationsComponent,
];


@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...declarations,
  ],

})
export class StoreOperationsModule { }
