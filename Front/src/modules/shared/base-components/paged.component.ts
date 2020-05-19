import { PageEvent } from '@angular/material';
import { SmartComponent } from './smart.component';
import { TranslationService } from '../services';
import { ServerTranslatePipe } from '../pipes/server-translate.pipe';

export class PagedComponent extends SmartComponent  {
  totalCount = 0;
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  limit = this.pageSize;
  skip = 0;
  sortField: string;
  sortDirection: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  init() {
  }

  onPage(pageEvent: PageEvent) {
    this.limit = pageEvent.pageSize;
    this.skip = pageEvent.pageIndex * pageEvent.pageSize;
  }

}
