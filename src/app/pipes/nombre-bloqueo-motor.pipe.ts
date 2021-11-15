import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreBloqueoMotor'
})
export class NombreBloqueoMotorPipe implements PipeTransform {

    transform(texto: string): string {
        if (texto === '>SXASES1<') {
            return 'Motor bloqueado';
        } else {
            return 'Motor desbloqueado';
        }
     }

}
