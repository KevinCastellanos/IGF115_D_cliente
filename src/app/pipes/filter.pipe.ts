import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any[], searchText: string, cantidadFiltro: any): any[] {

        // retorna un arreglo vacío sino encuentra coincidencia
        if (!items) {
            return [];
        }

        // retornar todos los item si va vacío
        if (!searchText) {
            cantidadFiltro.count = items.length;
            return items;
        }

        // texto a buscar
        searchText = searchText.toLowerCase();


        if (isNaN(Number(searchText))) {
            // texto ingreado no es un numero
            // console.log(searchText);
            const filtro = items.filter( code => code.nombre.toLowerCase().includes(searchText));
            cantidadFiltro.count = filtro.length;

            return filtro;
        } else {

            // texto ingresado es un numero
            const valor = Number(searchText);

            // si es una longitud de mayor de 5 digito de numero,
            // significa que esta buscando un vehiculo por imei
            if (valor.toString().length > 5) {
                const filtro = items.filter( code => {
                    return code.imei.includes(searchText);
                });
                cantidadFiltro.count = filtro.length;

                return filtro;
            } else {
                const filtro = items.filter( code => {
                    return code.nombre.toLowerCase().includes(searchText);
                });
                cantidadFiltro.count = filtro.length;

                return filtro;
            }
        }
    }

}
