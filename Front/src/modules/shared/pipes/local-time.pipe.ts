import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material';

@Pipe({
  name: 'localTime',
})
export class LocalTimePipe implements PipeTransform {
  constructor(
    private dateAdapter: DateAdapter<any>,

  ) {

  }
  transform(date: Date | string, locale: string, timeOnly: boolean): string {
    if (!date ) {
      return '';
    }
    const parsedDate = timeOnly ? moment(date, ['h:m a', 'H:m']) : moment(date);
    return this.dateAdapter.format(parsedDate, 'hh:mm A');
  }
}
