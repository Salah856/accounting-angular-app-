import { NgModule } from '@angular/core';
import { BasicDataRoutingModule } from './basic-data-routing.module';
import { BasicDataComponent } from './basic-data.component';

const modules = [
  BasicDataRoutingModule,
];

const declarations = [
  BasicDataComponent,
];


@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...declarations,
  ],

})
export class BasicDataModule { }
