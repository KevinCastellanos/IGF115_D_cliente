import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contadorDias'
})
export class ContadorDiasPipe implements PipeTransform {

    transform(tercerReporte: any): any {
        let dias = 0;
        if (tercerReporte.suma_referenciadas_domingo > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_referenciadas_lunes > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_referenciadas_martes > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_referenciadas_miercoles > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_referenciadas_jueves > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_referenciadas_viernes > 0) {
            dias += 1;
        }
        if (tercerReporte.suma_referenciadas_sabado > 0) {
            dias += 1;
        }
        return dias;
    }

}
