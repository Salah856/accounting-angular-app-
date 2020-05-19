import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Language } from '../models';
import { ReplaySubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { DateAdapter } from '@angular/material';


export const arabic: Language = {
  id: 'ar',
  name: 'العربية',
  dir: 'rtl',
  locale: 'ar_EG',
};
export const english: Language = {
  id: 'en',
  name: 'English',
  dir: 'ltr',
  locale: 'en_US',
};

export const availableLangs: Language[] = [
  arabic,
  english,
];


@Injectable()
export class TranslationService {

  private currentLanguage: ReplaySubject<Language> = new ReplaySubject(1);
  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private titleService: Title,
    private adapter: DateAdapter<any>
  ) {
    this.init();
  }

  init() {
    const initLangId = this.localStorageService.get('lang', false) || 'en';
    this.translateService.onLangChange.subscribe((data: LangChangeEvent) => {
      const currentLangObj = availableLangs.find((item) => item.id === data.lang);
      this.currentLanguage.next(currentLangObj);
    });
    this.setCurrentLanguage(initLangId);
    this.fixOverlaysDirBug();
  }

  setCurrentLanguage(langId: string) {
    this.translateService.use(langId);
    const newLang = availableLangs.find((item) => item.id === langId);
    this.adapter.setLocale(newLang.locale);
    document.dir = newLang.dir;
    this.localStorageService.set('lang', langId, false);
    document.getElementsByTagName('html')[0].setAttribute('lang', langId);
    this.translateService.get('SYSTEM_NAME')
      .pipe(
        take(1)
      )
      .subscribe((val) => {
        this.titleService.setTitle(val);

      });
  }

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage.asObservable();
  }

  fixOverlaysDirBug() {
    setInterval(() => {
      const documentDir = document.dir;

      const overlays = document.getElementsByClassName('cdk-overlay-pane');
      // const boxes = document.getElementsByClassName('cdk-overlay-connected-position-bounding-box');
      for (let i = 0; i < overlays.length; i++) {
        if (overlays[i].getAttribute('dir') !== documentDir) {
          overlays[i].setAttribute('dir', documentDir);
        }
      }
      // for (let i = 0; i < boxes.length; i++) {
      //   if (boxes[i].getAttribute('dir') !== documentDir) {
      //     boxes[i].setAttribute('dir', documentDir);
      //   }
      // }
    }, 50);
  }
  instant(key: string) {
    return this.translateService.instant(key);
  }

  get(key: string|string[]): Observable<any> {
    return this.translateService.get(key);
  }
}


