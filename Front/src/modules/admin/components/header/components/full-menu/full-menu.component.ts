import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from '../../models/Menu';
import { TranslationService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { TranslatedComponent } from 'src/modules/shared/base-components/translated.component';

@Component({
  selector: 'acc-full-menu',
  templateUrl: './full-menu.component.html',
  styleUrls: ['./full-menu.component.scss']
})
export class FullMenuComponent extends TranslatedComponent implements OnInit, OnDestroy {
  @Input() menuItems: MenuItem[] = [];

  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe
  ) { 
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy();
  }
}
