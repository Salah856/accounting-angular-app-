// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Project imports
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent, HeaderModule } from './components';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { LoginGuard, HomeGuard } from './guards';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminLoginService } from './services/admin-login.service';
import { AdminHomeService } from './services/admin-home.service';
import { FoundationsService } from './services/foundations.service';
import { AppsService } from './services/apps.service';
import { UsersService } from './services/users.service';


const components = [
  AdminComponent,
  LoginComponent,
  AdminHomeComponent,
];

const guards = [
  LoginGuard,
  HomeGuard,
];

const interceptors = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

const services = [
  AdminLoginService,
  AdminHomeService,
  FoundationsService,
  AppsService,
  UsersService,
];


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    HeaderModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    ...components
  ],
  providers: [
    ...guards,
    ...interceptors,
    ...services,
  ]
})
export class AdminModule { }
