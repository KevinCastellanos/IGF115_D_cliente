import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

    public modulos: any;
    public vehiculos: any;
    public lan: any;
    public loading = true;

    constructor(public localStorageService: LocalStorageService,
                private restService: RestService,
                private router: Router) { 
        this.obtenerTextoIdioma(this.localStorageService.usuario.usuario.idioma);
    }

    ngOnInit() {
        // obtenemos los datos de idioma

        this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            // console.log('modulos asignados: ', this.someMethodIThinkMightBeSlow());
            // console.log(data);
            this.modulos = data;
            this.loading = false;
        }, (err) => {
            console.log(err);
        });

        this.obtenerVehiculosAsignados();
        this.obtenerGeocercas();
        console.log('orden: ', this.localStorageService.ordenVehiculos.orden);
        this.loginTemporal();
    }

    loginTemporal() {
        this.restService.login(this.localStorageService.usuario.usuario.usuario, this.localStorageService.usuario.usuario.password).subscribe((response) => {
            // console.log(response);
            // tslint:disable-next-line: no-string-literal
            if (response['token'] !== undefined) {
               
                // console.log('entro a sesion');

                // guardamos la sesion en el localStorage
                this.localStorageService.loginWS(this.localStorageService.usuario.usuario.usuario, response);
                

            } else {
                // console.log('Error en el login');
               
            }
        }, (err) => {
        
        });
    }

    configuraciones() {
        this.router.navigateByUrl('/configuracion-perfil');
    }

    obtenerTextoIdioma(language) {
        this.restService.obtenerTextoIdioma(language).subscribe((data) => {
            this.localStorageService.guardarLenguaje(data);
            this.obtenerTextoIdiomaEs();
        }, (err) => {
            console.log(err);
        });
    }

    obtenerTextoIdiomaEs() {
        this.restService.obtenerTextoIdioma('es').subscribe((data) => {
            this.localStorageService.guardarLenguajeEs(data);
        }, (err) => {
            console.log(err);
        });
    }

    obtenerVehiculosAsignados() {

        // tslint:disable-next-line: max-line-length
        this.restService.obtenerVehiculosPorUsuarios(this.localStorageService.usuario.usuario.grupos).subscribe((data) => {

            // lugar antiguo de almacenamiento da vehiculos
            // this.mapService.vehiculos = data;
            // a partir de este punto se van a utilizar la variable almacenada en el localStorage
            //console.log('vehiculos obtenidos: ',data);
            // tslint:disable-next-line: forin
            /*for (const i in data) {
                data[i].visibilidad2 = 1;
            }*/
            this.localStorageService.guardarVehiculos(data);
        }, (err) => {
            console.log(err);
        });
    }

    obtenerGeocercas() {
        this.restService.obtenerGeocercas3(this.localStorageService.usuario.usuario.grupos).subscribe((data) => {
            // console.log('geocercas---: ', data);
            let geoOrdenado: any[] = [];
            for (const geo of data) {
                if (Boolean(JSON.parse(geo['circular'])) === false) {
                    geo['coordenada_geocerca'].sort(function(a, b) { return a.orden - b.orden; });
                    geoOrdenado.push(geo);
                } else {
                    geoOrdenado.push(geo);
                }
            }
            this.localStorageService.guardarGeocercas(geoOrdenado);
        }, (err) => {
            console.log(err);
        });
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    someMethodIThinkMightBeSlow() {
        const startTime = performance.now();

        // Do the normal stuff for this function
        const duration = performance.now() - startTime;
        console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);
    }

    cambiarIdioma(idioma) {
        console.log(this.localStorageService.usuario.usuario.idioma);
        this.localStorageService.usuario.usuario.idioma = idioma;
        this.localStorageService.guardarStorage(this.localStorageService.usuario);
        // tslint:disable-next-line: max-line-length
        this.restService.cambiarIdioma(this.localStorageService.usuario.usuario.id_usuario, idioma).subscribe((res) => {
            console.log(res);
            window.location.reload();
        }, (err) => {
            console.log(err);
        });
    }

    loginOps(ruta) {
        // console.log('ruta de login: ', ruta);
        this.restService.opsLogin1(this.localStorageService.usuario.usuario.usuario, this.localStorageService.usuario.usuario.password).then((res) => {
            console.log('respuesta',res);
            window.location.href = 'https://ops.tkontrol.com/login2.php?token=' + res['token'];
        }).catch(e => console.log(e) );
        
        // window.location.href = 'https://ops.tkontrol.com/login2.php?token=5814ergr89';

    }


}
