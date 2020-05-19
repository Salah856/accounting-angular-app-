import { NgModule } from '@angular/core';

import { FoundationsComponent } from './foundations.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { FoundationsRoutingModule } from './foundations-routing.module';
import { ListFoundationComponent, ShowFoundationComponent, EditFoundationComponent } from './components';


const modules = [
  SharedModule,
  FoundationsRoutingModule
];

const declarations = [
  FoundationsComponent,
  ListFoundationComponent,
  ShowFoundationComponent,
  EditFoundationComponent,
];

const services = [
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
export class FoundationsModule { }
