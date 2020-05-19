import { MatPaginatorIntl } from '@angular/material';
import { TranslationService } from './translation.service';
import { mergeMap } from 'rxjs/operators';
export class PaginatorIntlService extends MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel = '';
  previousPageLabel = '';
  firstPageLabel = '';
  lastPageLabel = '';
  itemsOf = '';
  constructor(
    private translationService: TranslationService,
  ) {
    super();
      this.translationService.getCurrentLanguage()
      .pipe(
        mergeMap(() => {
          return this.translationService.get([
            'ITEMS_PER_PAGE',
            'NEXT_PAGE',
            'PREVIOUS_PAGE',
            'LAST_PAGE',
            'ITEMS_OF',
            'FIRST_PAGE']
          );
        })
      )
      .subscribe(
        (items) => {
          this.nextPageLabel = items.NEXT_PAGE;
          this.lastPageLabel = items.LAST_PAGE;
          this.firstPageLabel = items.FIRST_PAGE;
          this.itemsPerPageLabel = items.ITEMS_PER_PAGE;
          this.previousPageLabel = items.PREVIOUS_PAGE;
          this.itemsOf = items.ITEMS_OF;
          this.changes.next();
        }
      );
  }
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0  ${this.itemsOf}  ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex}  ${this.itemsOf}  ${length} `;
  }

}
