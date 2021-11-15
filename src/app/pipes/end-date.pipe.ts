import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'endDate'
})
export class EndDatePipe implements PipeTransform {

  transform(value: unknown): unknown {
    return moment().day("Saturday").week(Number(value)).format('YYYY-MM-DD');
  }

}
