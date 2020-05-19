import { Pipe, PipeTransform } from '@angular/core';
import { arabic, english } from '../services';

/*
 * Translate server data to current language
 * expected input => 'arValue|enValue'
 * output => traslated value
*/
@Pipe({
  name: 'serverTranslate',
})
export class ServerTranslatePipe implements PipeTransform {

  transform(token: string, langCode: string): string {
    if (!langCode || !token) {
      return '';
    } else if (langCode === arabic.id) {
      return token.split('|')[0];
    } else if (langCode === english.id) {
      return token.split('|')[1];
    } else {
      return '';
    }
  }
}
