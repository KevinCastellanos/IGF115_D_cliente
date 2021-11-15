import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterImei'
})
export class FilterImeiPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter( code => {
            return code.imei.toLowerCase().includes(searchText);
        });
    }

}
