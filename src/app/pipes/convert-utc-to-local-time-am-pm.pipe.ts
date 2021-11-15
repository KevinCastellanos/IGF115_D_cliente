import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertUtcToLocalTimeAmPm'
})
export class ConvertUtcToLocalTimeAmPmPipe implements PipeTransform {

  transform(event_time: any): any {
    return moment.utc(event_time).local().format('YYYY-MM-DD LTS');
  }

}
