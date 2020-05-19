/**
  * Usage: dateString | localDate:'format'
 **/

import { Pipe, PipeTransform, Inject } from '@angular/core';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material';
@Pipe({
  name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

  constructor(
    private dateAdapter: DateAdapter<any>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) { }

  transform(value: any, locale: string) {
    if (!value) {
      return '';
    }
    return this.dateAdapter.format(moment(value), this.dateFormats.display.dateA11yLabel);
  }
}
