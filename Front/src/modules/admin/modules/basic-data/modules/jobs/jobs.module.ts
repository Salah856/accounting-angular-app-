import { NgModule } from '@angular/core';

import { JobsComponent } from './jobs.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { ListJobComponent, ShowJobComponent, EditJobComponent } from './components';
import { JobsService } from './services';


const modules = [
  SharedModule,
  JobsRoutingModule
];

const declarations = [
  JobsComponent,
  ListJobComponent,
  ShowJobComponent,
  EditJobComponent,
];

const services = [
  JobsService
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
export class JobsModule { }
