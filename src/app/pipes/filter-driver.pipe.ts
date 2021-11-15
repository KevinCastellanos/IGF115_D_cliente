import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDriver'
})
export class FilterDriverPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter( driver => {
            return driver.name.toLowerCase().includes(searchText) || driver.name_vehicle.toLowerCase().includes(searchText);
        });
    }

}
