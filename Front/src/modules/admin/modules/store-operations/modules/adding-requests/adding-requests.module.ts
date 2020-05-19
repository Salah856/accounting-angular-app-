import { NgModule } from '@angular/core';

import { AddingRequestsComponent } from './adding-requests.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { AddingRequestsRoutingModule } from './adding-requests-routing.module';
import { ListAddingRequestComponent, ShowAddingRequestComponent, EditAddingRequestComponent } from './components';
import { AddingRequestsService } from './services';


const modules = [
  SharedModule,
  AddingRequestsRoutingModule
];

const declarations = [
  AddingRequestsComponent,
  ListAddingRequestComponent,
  ShowAddingRequestComponent,
  EditAddingRequestComponent,
];

const services = [
  AddingRequestsService
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
export class AddingRequestsModule { }
