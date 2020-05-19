import { TranslationService } from '../services';
import { ServerTranslatePipe } from '../pipes/server-translate.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class TranslatedComponent {
  lang: string;
  locale: string;
  ngUnsubscribe: Subject<boolean> = new Subject();
  constructor(
    public translationService: TranslationService,
    public serverTranslatePipe: ServerTranslatePipe,
  ) {
    this.translationService.getCurrentLanguage()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      (lang) => {
        this.lang = lang.id;
        this.locale = lang.locale;
      }
    );
  }
  getTotalName(data: any) {
    return data ? `${data.arName}|${data.enName}` : null;
  }
  onDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
