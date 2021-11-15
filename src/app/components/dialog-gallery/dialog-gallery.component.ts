import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as moment from 'moment';

declare let L;

@Component({
  selector: 'app-dialog-gallery',
  templateUrl: './dialog-gallery.component.html',
  styleUrls: ['./dialog-gallery.component.css']
})
export class DialogGalleryComponent implements OnInit, OnDestroy {

    public imagen = '/assets/cargando.gif';
    public imageNoDisponible = '/assets/imagen_no_disponible.png';

    public map;
    public marker;
    public googleLayer;
    public controlZoom;
    public nombre = '';

    public uploadedPhoto = false;
    // gestion de fotos
    public fotos: any[] = [];
    public indexSelected = -1;
    public fotoTotales = 0;
    public fotoSeleccionado = 0;

    public ant = false;
    public sig = false;

    public datos = {
        ps00: '',
        PS00: '',
        address: '',
        event_time: '',
        lat: 0,
        lng: 0
    }


    constructor(public dialogRef: MatDialogRef<DialogGalleryComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private localStorageService: LocalStorageService) { }

    ngOnInit(): void {
        this.uploadedPhoto = false;
        // console.log(this.data);

        // actualizamos los datos de descripcion de foto
        this.datos.ps00 = this.data.title.ps00;
        this.datos.PS00 = this.data.title.PS00;
        this.datos.address = this.data.title.address;
        this.datos.event_time = this.data.title.event_time;
        this.datos.lat = this.data.title.lat;
        this.datos.lng = this.data.title.lng;


        for(let i in this.data.eventos) {
            if (this.data.eventos[i].PS00) {
                this.fotos.push(this.data.eventos[i]);
            }
        }

        // console.log('eventos con foto: ', this.fotos);
        this.fotoTotales = this.fotos.length;
        
        //buscamos el index y la info de la foto
        const indexFoto = this.fotos.findIndex((f) => String(f.PS00) === String(this.data.PS00));

        if (indexFoto > -1) {
            // console.log('index seleccionado default: ', indexFoto);
            this.indexSelected = indexFoto;
            this.fotoSeleccionado = indexFoto;
            this.fotoSeleccionado++;
            this.obtenerImagen(this.data.imei, this.fotos[indexFoto].PS00);

            // si el index es igual al tamaño del array hay que bloquear el boton
            if (this.indexSelected == 0) {
                this.ant = true;
            }

            // si el index es igual al tamaño del array hay que bloquear el boton
            if (this.indexSelected == this.fotos.length-1) {
                this.sig = true;
            }
        } else {
            console.log('no se encontro index');
        }

        
        // this.cargarMapaLeaflet();

        const ve = this.localStorageService.vehiculos.find((v) => String(v.imei) == String(this.data.imei));

        if (ve) {
            this.nombre = ve.nombre;
            // console.log('nombre vehiculo: ', this.nombre);
        } else {
            // console.log('no hay');
        }

    }

    ngOnDestroy() {
        this.map = null;
        this.marker = null;
        this.googleLayer = null;
        this.controlZoom = null;
    }

    obtenerImagen(imei, PS00) {
        this.restService.obtenerImagen(imei, PS00).subscribe((data) => {
            
            if (data['ok'] === true) {
                this.imagen = data['data'];
                this.uploadedPhoto = true;
            } else {
                this.imagen = this.imageNoDisponible;
                this.uploadedPhoto = true;
            }
            
        }, (error) => {
            console.log(error);
            this.imagen = this.imageNoDisponible;
            this.uploadedPhoto = true;;
        });
    }
    cargarMapaLeaflet() {

        // agregamos mapa al componente *******************************************************************************************
        // cargamos mapa de leaflet con capa de google map
        // Note the difference in the "lyrs" parameter in the URL:
        // Hybrid: s,h;
        // Satellite: s;
        // Streets: m;
        // Terrain: p;
        this.map =  L.map('map2', {
            zoomControl: false,
            center: new L.LatLng(this.data.title.lat, this.data.title.lng),
            zoom: 14,
            editable: false
        });

        // Cargamos el layer de google maps ***************************************************************************************
        this.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            reuseTiles: true,
            updateWhenIdle: true,
            keepBuffer: 2
        }).addTo(this.map);


        // Agregamos los controles de zoom al mapa *********************************************************************************
        this.controlZoom = L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);


        var pulsingIcon = L.icon.pulse({iconSize:[20,20], color:'red'});
        this.marker = L.marker([this.data.title.lat, this.data.title.lng],{icon: pulsingIcon}).addTo(this.map);

    }

    cerrar(): void {
        this.dialogRef.close({cancel: true});
    }

    siguienteFoto() {
        this.ant = false;
        this.uploadedPhoto = false;
        // console.log('index actual: ', this.indexSelected);
        this.indexSelected += 1;
        // nos aseguramos que no agarre valores mayores a la longutud del array
        // evaluamos si hay datos en la siguiente posicion
        // evaluamos que haya fotos para mostrar
        if (this.indexSelected <= this.fotos.length-1) {

            // console.log('index siguiente: ', this.indexSelected);
            // console.log('lenght: ', this.fotos.length-1);
            // buscamos la info que esta en la siguiente posicion
            //buscamos el index y la info de la foto
            let indexFoto = this.fotos.findIndex((f) => String(f.PS00) === String(this.fotos[this.indexSelected].PS00));
            
            if (indexFoto > -1) {
                // actualizamos la informacion de descripcion
                this.datos.ps00 = this.fotos[indexFoto].ps00;
                this.datos.PS00 = this.fotos[indexFoto].PS00;
                this.datos.address = this.fotos[indexFoto].address;
                this.datos.event_time = this.fotos[indexFoto].event_time;
                this.datos.lat = this.fotos[indexFoto].lat;
                this.datos.lng = this.fotos[indexFoto].lng;

                this.indexSelected = indexFoto;
                this.fotoSeleccionado++;
                
                this.obtenerImagen(this.data.imei, this.fotos[indexFoto].PS00);
            }

            // si el index es igual al tamaño del array hay que bloquear el boton
            if (this.indexSelected == this.fotos.length-1) {
                this.sig = true;
            }
        } else {
            // console.log('ya no hay foto que mostrar siguiente');
            this.fotoSeleccionado = this.fotos.length;
            this.indexSelected = this.fotos.length-1;
            this.sig = true;
        }

        
    }

    anteriorFoto() {
        this.sig = false;

        this.uploadedPhoto = false;

        // nos aseguramos que no agarre valor menor a -1
        if (this.indexSelected >-1) {
            this.indexSelected--;
            // console.log('index: ', this.indexSelected);
            // console.log('lenght: ', this.fotos.length);
        }
        // evaluamos si hay datos en la siguiente posicion
        
        // evaluamos que haya fotos para mostrar
        if (this.indexSelected >= 0) {
            //buscamos el index y la info de la foto
            let indexFoto = this.fotos.findIndex((f) => f.PS00 === this.fotos[this.indexSelected].PS00);
            if (indexFoto > -1) {
                // actualizamos la informacion de descripcion
                this.datos.ps00 = this.fotos[indexFoto].ps00;
                this.datos.PS00 = this.fotos[indexFoto].PS00;
                this.datos.address = this.fotos[indexFoto].address;
                this.datos.event_time = this.fotos[indexFoto].event_time;
                this.datos.lat = this.fotos[indexFoto].lat;
                this.datos.lng = this.fotos[indexFoto].lng;
                this.indexSelected = indexFoto;
                this.fotoSeleccionado--;
                this.obtenerImagen(this.data.imei, this.fotos[indexFoto].PS00);
            }

            // si el index es igual al tamaño del array hay que bloquear el boton
            if (this.indexSelected == 0) {
                this.ant = true;
            }
        } else {
            // console.log('ya no hay foto que mostrar anterior');
            this.fotoSeleccionado = 1;
            this.ant = true;
        }
    }

    isDesktop(): boolean {
        // es escritorio?
        if (window.innerWidth > 575) {
            // si es escritorio
            return true;
        } else {
            // no es escritorio
            return false;
        }
    }

    verDetalle() {
        if(!this.isDesktop()) {
            var x = document.getElementById('detalle');
            x.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    fechaFormateada(fecha) {
        return moment(fecha).format('YYYY-MM-DD LTS');
    }
}
