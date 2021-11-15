import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapService } from 'src/app/services/map.service';
import { RestService } from 'src/app/services/rest.service';

declare let L;

@Component({
  selector: 'app-dialog-atender-notificacion',
  templateUrl: './dialog-atender-notificacion.component.html',
  styleUrls: ['./dialog-atender-notificacion.component.css']
})
export class DialogAtenderNotificacionComponent implements OnInit {

    public map: any;
    public googleLayer: any;
    public comentario = '';

  constructor(public dialogRef: MatDialogRef<DialogAtenderNotificacionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public mapService: MapService,
              public restService: RestService) { }

  ngOnInit() {
      this.cargarMapaLeaflet();
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({cancel: true});
  }

    atenderNotifcacion() {
        console.log('comentario agregado: ', this.comentario);
        this.restService.actualizarNotificacionAtendida(this.data.id_notificacion_endpoint_evento, this.comentario).subscribe(() => {
            console.log('existe notificacion para eliminar o pasar a otro estado');
            this.dialogRef.close({cancel: false});
        }, (err) => {
            console.log(err);
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
    this.map = new L.map('mapView', {
        zoomControl: false,
        center: new L.LatLng(this.data.lat, this.data.lng),
        zoom: 16,
        dragging: false
    });

    // Cargamos el layer de google maps ***************************************************************************************
    this.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 15,
        minZoom: 15,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);


    // Agregamos los controles de zoom al mapa *********************************************************************************
    /*this.map.controlZoom = L.control.zoom({
        position: 'bottomright'
    }).addTo(this.map);*/

    var redMarker = L.ExtraMarkers.icon({
        markerColor: 'orange-dark',
        shape: 'circle',
        prefix: 'fa'
    });

    L.marker([this.data.lat, this.data.lng], {icon: redMarker}).addTo(this.map);
}

}
