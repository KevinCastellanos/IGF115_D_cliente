import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGroup'
})
export class FilterGroupPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {
        if (!items) {
            return [];
        }

        if (!searchText) {
            return items;
        }

        searchText = searchText.toLowerCase();

        return items.filter( grupo => {
            return grupo.nombre_grupo.toLowerCase().includes(searchText);
        });
    }
}
