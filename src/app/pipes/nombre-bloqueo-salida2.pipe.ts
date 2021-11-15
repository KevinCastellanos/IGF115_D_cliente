import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreBloqueoSalida2'
})
export class NombreBloqueoSalida2Pipe implements PipeTransform {

    transform(texto: string): string {
        if (texto === '>SSSXP21<') {
            return 'Salida 2 bloqueado';
        } else {
            return 'Salida 2 desbloqueado';
        }
     }

}
