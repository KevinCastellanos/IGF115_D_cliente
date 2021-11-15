import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterColeccion'
})
export class FilterColeccionPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter( coleccion => {
            return coleccion.nombre.toLowerCase().includes(searchText);
        });
    }

}
