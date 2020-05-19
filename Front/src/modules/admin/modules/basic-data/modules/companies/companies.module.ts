import { NgModule } from '@angular/core';

import { CompaniesComponent } from './companies.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { ListCompanyComponent, ShowCompanyComponent, EditCompanyComponent } from './components';
import { CompaniesService } from './services';


const modules = [
  SharedModule,
  CompaniesRoutingModule
];

const declarations = [
  CompaniesComponent,
  ListCompanyComponent,
  ShowCompanyComponent,
  EditCompanyComponent,
];

const services = [
  CompaniesService
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
export class CompaniesModule { }
