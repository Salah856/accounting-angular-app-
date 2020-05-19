import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Language } from 'src/modules/shared/models';

@Component({
  selector: 'acc-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {

  @Output() toggleLang = new EventEmitter<boolean>();
  @Input() currentLanguage: string;
  @Input() langs: Language[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  switch() {
    // this.switchLng.emit(this.currentLanguage);
    this.toggleLang.emit(true);
  }
  get langName() {
    const langObj = this.langs.find((item) => item.id === this.currentLanguage);
    if (langObj) {
      return langObj.name;
    } else {
      return '';
    }
  }

}
