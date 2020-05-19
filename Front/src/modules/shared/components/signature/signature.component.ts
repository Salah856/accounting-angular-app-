import { Component, Input } from '@angular/core';
import { TranslatedComponent } from '../../base-components/translated.component';
import { TranslationService } from '../../services';
import { ServerTranslatePipe } from '../../pipes/server-translate.pipe';

@Component({
  selector: 'acc-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent extends TranslatedComponent {
  @Input() signature: string;

  get username() {
    return this.signature ? this.signature.split('@')[0] : null;
  }

  get date() {
    return this.signature ? this.signature.split('@')[1] : null;
  }
  constructor(
    translationService: TranslationService,
    serverTranslate: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslate);
  }

}
