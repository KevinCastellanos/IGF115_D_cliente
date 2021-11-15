import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDrag'
})
export class FilterDragPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {

    // retorna un arreglo vacío sino encuentra coincidencia
    if (!items) {
        return [];
    }

    // retornar todos los item si va vacío
    if (!searchText) {
        return items;
    }

    // texto a buscar
    searchText = searchText.toLowerCase();


    if (isNaN(Number(searchText))) {
        // texto ingreado no es un numero
        // console.log(searchText);
        return items.filter( code => {
            return code.toLowerCase().includes(searchText);
        });
    } else {

        // texto ingresado es un numero
        const valor = Number(searchText);

        // si es una longitud de mayor de 3 digito de numero,
        // significa que esta buscando un vehiculo por imei
        if (valor.toString().length > 3) {
            return items.filter( code => {
                return code.includes(searchText);
            });
        } else {
            return items.filter( code => {
                return code.toLowerCase().includes(searchText);
            });
        }
    }
}

}
