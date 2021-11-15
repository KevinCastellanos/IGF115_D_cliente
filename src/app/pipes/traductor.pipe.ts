import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'traductor'
})
export class TraductorPipe implements PipeTransform {

    transform(value: any): any {

        let usuario;
        if (localStorage.getItem('lenguaje')) {

            if (localStorage.getItem('usuario')) {

                usuario = JSON.parse(localStorage.getItem('usuario'));

                // evaluamos cual es el idioma predeterminado del usuario
                if (usuario.usuario.idioma === 'es') {
                    // console.log('lenguaje español');
                    return value;
                } else {
                    let lenguajeEn;
                    let lenguajeEs;
        
                    lenguajeEs = JSON.parse(localStorage.getItem('lenguaje-es'));
                    lenguajeEn = JSON.parse(localStorage.getItem('lenguaje'));

                    
                    if (lenguajeEn[this.getKeyByValue(lenguajeEs, value)] !== undefined) {
                        return lenguajeEn[this.getKeyByValue(lenguajeEs, value)];
                    } else {
                        // console.log('value: ', value, lenguajeEs.lan215);
                        return 'sin traducción 3';
                    }
                }
            } else {
                return 'sin traducción 2';
            }

        } else {
            return 'sin traducción 1';
        }

    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
}
