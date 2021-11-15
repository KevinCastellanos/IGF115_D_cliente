import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-configuraciones-perfil',
  templateUrl: './configuraciones-perfil.component.html',
  styleUrls: ['./configuraciones-perfil.component.css']
})
export class ConfiguracionesPerfilComponent implements OnInit {

    public modulos: any;
    public vehiculos: any;

    public vistaViajePredeterminado = false;
    public vistaViajeAumentada = false;

    constructor(public localStorageService: LocalStorageService,
                private restService: RestService) { }

    ngOnInit() {
        this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            // console.log('modulos asignados: ');
            // console.log(data);
            this.modulos = data;
        }, (err) => {
            console.log(err);
        });

        if (this.localStorageService.vistaViaje.op === 'pre') {
            this.vistaViajePredeterminado = true;
            this.vistaViajeAumentada = false;
        } else {
            this.vistaViajePredeterminado = false;
            this.vistaViajeAumentada = true;
        }

        console.log('titulo marcador: ', this.localStorageService.monitoreo.tituloMarcador);
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    configVistaViaje(vista) {
        console.log('vista de viajes: ', vista);

        // actualizamos la preferencial localmente
        this.localStorageService.guardarVistaViaje(vista);

        // guardamos la preferencia en la base de datos
        this.restService.guardarVistaViaje(this.localStorageService.usuario.usuario.id_usuario, vista).subscribe((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        })
    }

    cambiarEstadoTituloMarcador(event) {
        console.log(event.checked);
        this.localStorageService.guardarTituloMarcador(event.checked);
    }

    cambiarEstadoAgrupacionMarcador(event) {
        this.localStorageService.guardarAgrupacionMarcador(event.checked);
    }

    cambiarEstadoPopupZoom(event) {

        if (event.checked === true) {
            this.localStorageService.guardarPopupZoom(event.checked);
            this.localStorageService.guardarAgrupacionMarcador(false);
        } else {
            this.localStorageService.guardarPopupZoom(event.checked);
            this.localStorageService.guardarAgrupacionMarcador(true);
        }
        
    }
}