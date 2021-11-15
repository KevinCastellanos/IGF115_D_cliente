import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'startDate'
})
export class StartDatePipe implements PipeTransform {

  transform(value: unknown): unknown {
    return moment().day("Sunday").week(Number(value)).format('YYYY-MM-DD');
  }

}
