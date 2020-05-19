import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { TranslationService } from './translation.service';

@Injectable()
export class ToastService {
  langId: string;
  toastSettings: Partial<IndividualConfig> = {
    positionClass: 'toast-bottom-right',
  };
  constructor(
    private toastrService: ToastrService,
    private translationService: TranslationService,
  ) {
    this.init();
  }

  init() {
    this.translationService.getCurrentLanguage()
      .subscribe(
        (lang) => {
          this.langId = lang.id;
          if (lang.dir === 'rtl') {
            this.toastSettings.positionClass = 'toast-bottom-left';
          } else if (lang.dir === 'ltr') {
            this.toastSettings.positionClass = 'toast-bottom-right';
          }
        }
      );
  }

  showSuccess(message: string, title?: string, settings?: Partial<IndividualConfig>) {
    this.toastrService.success(message, title || '', {...settings, ...this.toastSettings});
  }

}


