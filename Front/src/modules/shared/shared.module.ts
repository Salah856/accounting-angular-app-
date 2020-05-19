// Angular imports
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Third party imports
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

// Project imports
import {
  LoadingComponent,
  ConfirmDialogComponent,
  FooterComponent,
  LoadingBtnComponent,
  PassMaskBtnComponent,
  FileUploadComponent,
  ResponsiveTableComponent,
  PageHeaderBarComponent,
  SignatureComponent,
  ScopeComponent,
  MultiLevelSelectComponent,
} from './components';

import {
  ScreenService,
  LocalStorageService,
  ToastService,
  TranslationService,
  PaginatorIntlService,
} from './services';

import {
  MatMenuModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatPaginatorIntl,
  MatDialogModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatChipsModule,
  MatTreeModule,
  MatProgressBarModule,
  MatTabsModule
} from '@angular/material';
import { ServerTranslatePipe } from './pipes/server-translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { SessionStorageService } from './services/session-storage.service';
import { LocalTimePipe } from './pipes/local-time.pipe';


const services = [
  ScreenService,
  LocalStorageService,
  ToastService,
  TranslationService,
  SessionStorageService,
  {
    provide: MatPaginatorIntl,
    useClass: PaginatorIntlService,
    deps: [TranslationService],
  },
  { provide: MAT_DATE_LOCALE, useValue: 'en_US' },
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

];

const pipes = [
  ServerTranslatePipe,
  LocalDatePipe,
  LocalTimePipe,
];

const modules = [
  CommonModule,
  MatToolbarModule,
  MatDividerModule,
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  FormsModule,
  RouterModule,
  MatSidenavModule,
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatTooltipModule,
  TranslateModule,
  MatDialogModule,
  MatDatepickerModule,
  MatChipsModule,
  MatTreeModule,
  MatTabsModule,
];

const components = [
  LoadingComponent,
  ConfirmDialogComponent,
  FooterComponent,
  LoadingBtnComponent,
  PassMaskBtnComponent,
  ResponsiveTableComponent,
  FileUploadComponent,
  PageHeaderBarComponent,
  SignatureComponent,
  ScopeComponent,
  MultiLevelSelectComponent,
];



const entryComponents = [
  ConfirmDialogComponent,
];

@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...components,
    ...pipes,
  ],
  exports: [
    ...components,
    ...modules,
    ...pipes
  ],
  entryComponents: [
    ...entryComponents
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ...services,
        ...pipes,
      ],

    };
  }
}
