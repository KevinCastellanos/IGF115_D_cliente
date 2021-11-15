import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGeocerca'
})
export class FilterGeocercaPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter( geo => {
            return geo.nombre_geocerca.toLowerCase().includes(searchText);
        });
    }

}
