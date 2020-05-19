import { NgModule } from '@angular/core';

import { CurrenciesComponent } from './currencies.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { CurrenciesRoutingModule } from './currencies-routing.module';
import { ListCurrencyComponent, ShowCurrencyComponent, EditCurrencyComponent } from './components';
import { CurrenciesService } from './services';


const modules = [
  SharedModule,
  CurrenciesRoutingModule
];

const declarations = [
  CurrenciesComponent,
  ListCurrencyComponent,
  ShowCurrencyComponent,
  EditCurrencyComponent,
];

const services = [
  CurrenciesService
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
export class CurrenciesModule { }
