import { TranslatedComponent } from './translated.component';
import { TranslationService } from '../services';
import { ServerTranslatePipe } from '../pipes/server-translate.pipe';
import { CrudData } from '../models/crud-data.model';

export class SmartComponent extends TranslatedComponent {
  isLoading = false;
  errors: string[] = [];

  constructor(
     translationService: TranslationService,
     serverTranslatePipe: ServerTranslatePipe
  ) {
    super(translationService, serverTranslatePipe);
  }

  beforeLoadingData() {
    this.errors = [];
    this.isLoading = true;
  }

  afterLoadingData(err?: string) {
    this.isLoading = false;
    if (err) {
      this.errors.push(err);
    }
  }

  // getSignatureUser(data: CrudData) {
  //   return data && data.signature ?
  //     data.signature.split('@')[0] : null;
  // }

  // getSignatureDate(data: CrudData) {
  //   return data && data.signature ?
  //     data.signature.split('@')[1] : null;
  // }
}
