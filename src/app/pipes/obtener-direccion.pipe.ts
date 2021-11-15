import { Pipe, PipeTransform } from '@angular/core';

declare let L;

@Pipe({
  name: 'obtenerDireccion'
})
export class ObtenerDireccionPipe implements PipeTransform {

  transform(element: any): any {
     return this.direccion(element).then((data) => {
       return data;
     }).catch((err) => {
       return err;
     });
  }

  direccion(element) {
    return new Promise<string>((resolve, reject) => {
      L.esri.Geocoding.reverseGeocode().latlng([Number(element.lat), Number( element.lng)]).run((error, result, response) => {
          resolve(result['address']['City']);
      });
  });
  }

}
