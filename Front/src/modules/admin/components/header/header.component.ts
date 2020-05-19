import { Component, OnInit, Input } from '@angular/core';

import { MenuItem } from './models/Menu';
import { baseUrl } from 'src/api-config';
import { TranslatedComponent } from 'src/modules/shared/base-components/translated.component';
import { availableLangs, TranslationService } from 'src/modules/shared/services';
import { AdminLoginService } from '../../services/admin-login.service';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';


@Component({
  selector: 'acc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends TranslatedComponent implements OnInit {
  username: string;
  imageUrl: string;
  langs = availableLangs;
  @Input() menuItems: MenuItem[] = [];
  // menuItems: MenuItem[] = [
  //   {
  //     label: 'BASIC_DATA',
  //     route: 'basicData',
  //     subRoutes: [
  //       { label: 'COMPANIES', route: 'companies' },
  //       { label: 'JOBS', route: 'jobs' },
  //       { label: 'ITEM_TYPES', route: 'itemTypes' },
  //       { label: 'ITEM_CATEGORIES', route: 'itemCategories' },
  //       { label: 'ITEM_UNITS', route: 'itemUnits' },
  //       { label: 'CURRENCIES', route: 'currencies' },
  //       { label: 'PAYMENT_CLAUSES', route: 'paymentClauses' },
  //       { label: 'RECEIPT_CLAUSES', route: 'receiptClauses' },
  //       { label: 'STORES', route: 'stores' },
  //       { label: 'TREASURIES', route: 'treasuries' },
  //       { label: 'ITEMS', route: 'items' },

  //     ]
  //   },
  //   {
  //     label: 'SYSTEM_ADMIN',
  //     route: 'systemAdmin',
  //     subRoutes: [
  //       { label: 'USERS', route: 'users' },
  //       { label: 'FOUNDATIONS', route: 'foundations' },
  //     ]
  //   },
  // ];

  constructor(
    private adminLoginService: AdminLoginService,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.username = this.adminLoginService.getUsername();
    this.imageUrl = this.adminLoginService.getImageUrl();
    this.imageUrl = this.imageUrl ? `${baseUrl}${this.imageUrl}` : null;
  }

  switchLanguage() {
    const newLang = this.lang === 'ar' ? 'en' : 'ar';
    this.translationService.setCurrentLanguage(newLang);
  }

  onLogout() {
    this.adminLoginService.logout();
    location.reload();
  }

}
