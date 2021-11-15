import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertUtcToLocalDate'
})
export class ConvertUtcToLocalDatePipe implements PipeTransform {

  transform(event_time: any): any {
    return moment.utc(event_time).local().format('YYYY-MM-DD');
  }

}
