import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from '../../models/Menu';
import { TranslatedComponent } from 'src/modules/shared/base-components/translated.component';
import { TranslationService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';

@Component({
  selector: 'acc-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent extends TranslatedComponent implements OnInit, OnDestroy {
  @Input() menuItems: MenuItem[] = [];

  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
