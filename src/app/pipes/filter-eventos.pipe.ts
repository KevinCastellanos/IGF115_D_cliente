import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEventos'
})
export class FilterEventosPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter( ev => {
            return ev.evento.toLowerCase().includes(searchText);
        });
    }

}
