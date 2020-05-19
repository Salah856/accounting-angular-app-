import { NgModule } from '@angular/core';

import { TreasuriesComponent } from './treasuries.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { TreasuriesRoutingModule } from './treasuries-routing.module';
import { ListTreasuryComponent, ShowTreasuryComponent, EditTreasuryComponent } from './components';
import { TreasuriesService } from './services';


const modules = [
  SharedModule,
  TreasuriesRoutingModule
];

const declarations = [
  TreasuriesComponent,
  ListTreasuryComponent,
  ShowTreasuryComponent,
  EditTreasuryComponent,
];

const services = [
  TreasuriesService
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
export class TreasuriesModule { }
