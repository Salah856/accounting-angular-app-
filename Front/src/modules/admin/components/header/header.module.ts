import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';

import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { FullMenuComponent, MobileMenuComponent, UserBtnComponent, LanguageSwitcherComponent } from './components';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/modules/shared/shared.module';


const modules = [
  CommonModule,
  RouterModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  TranslateModule,
  // @todo : remove this import
  SharedModule,
];


const declarations = [
  HeaderComponent,
  FullMenuComponent,
  MobileMenuComponent,
  UserBtnComponent,
  LanguageSwitcherComponent
];

const services = [];

const entryComponents = [];

@NgModule({
  imports: [
    ...modules
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [
    ...declarations
  ],
  providers: [
    ...services
  ],
  entryComponents: [
    ...entryComponents
  ]
})
export class HeaderModule { }
