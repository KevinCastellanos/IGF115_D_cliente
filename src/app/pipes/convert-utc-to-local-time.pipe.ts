import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertUtcToLocalTime'
})
export class ConvertUtcToLocalTimePipe implements PipeTransform {

  transform(event_time: any): any {
    return moment.utc(event_time).local().format('YYYY-MM-DD HH:mm:ss');
  }

}
