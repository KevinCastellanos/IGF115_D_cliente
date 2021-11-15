import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { DialogImageComponent } from '../dialog-image/dialog-image.component';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
declare let L;
@Component({
  selector: 'app-event-live',
  templateUrl: './event-live.component.html',
  styleUrls: ['./event-live.component.css']
})
export class EventLiveComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('evento') evento;
  // tslint:disable-next-line: no-input-rename
  @Input('hora') hora;
  // tslint:disable-next-line: no-input-rename
  @Input('lat') lat;
  // tslint:disable-next-line: no-input-rename
  @Input('lng') lng;
  // tslint:disable-next-line: no-input-rename
  @Input('evento') velocidad;
  // tslint:disable-next-line: no-input-rename
  @Input('foto') foto;
  // tslint:disable-next-line: no-input-rename
  @Input('imei') imei;

  public direccion = 'obteniendo direccion, espere ...';
  constructor(private dialog: MatDialog,
              private restService: RestService) { }

  ngOnInit() {

    const inter = setInterval(() => {
      // console.log('lenght', this.latT);
      // console.log('lng', this.lngT);
      // tslint:disable-next-line: forin
      this.convertirDireciones();
      clearInterval(inter);
    }, 3000);
  }

  converterUTCToLocalTime(event) {
    // const utcTime = '2019-10-23 16:53:52';
    return moment.utc(event).local().format('HH:mm:ss');
  }
  convertAmPm(event) {
    return moment(event, 'hh:mm:ss').format('LTS');
  }

  verFoto() {

    this.restService.obtenerImagen(this.imei, this.foto).subscribe((data) => {
      // console.log(data);
      // tslint:disable-next-line: max-line-length
      this.openDialog(this.foto, data['data']);
    }, (error) => {
        console.log(error);
    });
  }

  openDialog(title: string, body: string) {
    const dialogRef = this.dialog.open(DialogImageComponent, {
      data: {
        title,
        body
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
    });
  }
  convertirMiAKm(millas: string) {
    return Number(Number(millas) * 1.609).toFixed(2);
  }

  async convertirDireciones() {
    this.direccion = await this.geocodeLatLng(this.lat, this.lng);
  }

  geocodeLatLng(lat1: number, lng1: number): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      L.esri.Geocoding.reverseGeocode().latlng([lat1, lng1]).run((error, result, response) => {
        resolve(result['address']['Match_addr']);
      });

    });
  }

}
