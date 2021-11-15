import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contadorDias2'
})
export class ContadorDias2Pipe implements PipeTransform {

    transform(tercerReporte: any): any {
        let dias = 0;
        if (tercerReporte.suma_noreferenciada_domingo > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_noreferenciada_lunes > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_noreferenciada_martes > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_noreferenciada_miercoles > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_noreferenciada_jueves > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_noreferenciada_viernes > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_noreferenciada_sabado > 0) {
            dias += 1;
        }
        return dias;
    }

}
