import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contadorDiasSumario2'
})
export class ContadorDiasSumario2Pipe implements PipeTransform {

    transform(tercerReporte: any): any {
        let dias = 0;
        if (tercerReporte.total_no_referenciado_domingo > 0) {
            dias += 1;
        }
        if (tercerReporte.total_no_referenciado_lunes > 0) {
            dias += 1;
        }
        if (tercerReporte.total_no_referenciado_martes > 0) {
            dias += 1;
        }
        if (tercerReporte.total_no_referenciado_miercoles > 0) {
            dias += 1;
        }
        if (tercerReporte.total_no_referenciado_jueves > 0) {
            dias += 1;
        }
        if (tercerReporte.total_no_referenciado_viernes > 0) {
            dias += 1;
        }
        if (tercerReporte.total_no_referenciado_sabado > 0) {
            dias += 1;
        }
        return dias;
    }

}
