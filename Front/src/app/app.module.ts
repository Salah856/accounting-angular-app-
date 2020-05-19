// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// Third party imports
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Project imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/modules/shared/shared.module';
import { HttpClient, HttpClientModule, HttpBackend } from '@angular/common/http';


export function HttpLoaderFactory(handler: HttpBackend) {
  const http = new HttpClient(handler);
  return new TranslateHttpLoader(http);
}

const imports = [
  BrowserModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  ToastrModule.forRoot({
    timeOut: 2000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    enableHtml: true,
  }),
  HttpClientModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpBackend]
    }
  }),
  SharedModule.forRoot(),
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ...imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
