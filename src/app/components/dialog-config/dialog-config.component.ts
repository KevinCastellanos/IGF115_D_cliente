import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfiguracionDispositivo } from '../../interfaces/configuracionDispositivo';
import { RestService } from '../../services/rest.service';
import { Etiqueta } from '../../interfaces/etiqueta';
import { NbToastrService, NbIconConfig } from '@nebular/theme';
import { CODIGOS_EVENTOS, CodigoEvento } from '../../interfaces/codigosEventos';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-config',
  templateUrl: './dialog-config.component.html',
  styleUrls: ['./dialog-config.component.css']
})
export class DialogConfigComponent implements OnInit {

  public config: ConfiguracionDispositivo = {};

  displayedColumns: string[] = ['cod_evento', 'etiqueta', 'id'];
  dataSource = this.config;
  etiquetas: Etiqueta[] = [];
  codigos: CodigoEvento[] = CODIGOS_EVENTOS;

  public isDisabled: boolean = true;
  private codigoSeleccionado: CodigoEvento;
  private etiquetaSeleccionado: Etiqueta;
  public fecha = '';
  public spinnerActualizar = 0;

  constructor(public dialogRef: MatDialogRef<DialogConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfiguracionDispositivo,
              private restService: RestService,
              private toastrService: NbToastrService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fecha = moment().format('YYYY-MM-DD HH:mm:ss');
    this.obtenerEtiquetas();
    this.data.configuracion.sort(function(a, b) { return Number(a.cod_evento) - Number(b.cod_evento); });
    this.dataSource = this.data;
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  obtenerEtiquetas() {

    this.restService.obtenerEtiquetas().subscribe((response) => {
      // console.log(response);
      this.etiquetas = [];  // vacias los datos

      // insertamos los datos en la tabla
      this.etiquetas.push(...response);

    }, (error) => {
      console.log(error);
    });
  }

  cambiarEtiquetaConfig(event) {

    const index = this.etiquetas.findIndex( (et) => {
      return et.id_etiqueta === event.id_etiqueta;
    });

    if (index > -1) {
      console.log('nuevo etiqueta', this.etiquetas[index]);

      // tslint:disable-next-line: max-line-length
      this.restService.actualizarEtiquetaConfiguracion(event.cod_configuracion,event.cod_evento, event.id_etiqueta, this.etiquetas[index].nombre, this.etiquetas[index].fotografia,
        this.etiquetas[index].icono, this.etiquetas[index].nombre_icono, this.etiquetas[index].descripcion_icono, this.etiquetas[index].color_icono).subscribe((res)=> {
        // console.log(res);
        // tslint:disable-next-line: no-string-literal
        if ( res['changedRows'] === 1) {
          this.showToast('Etiqueta actualizado', '1 correctamente', 'top-right', 'success', 3000, 'checkmark-outline');
        } else {
          this.showToast('Etiqueta NO actualizado', '1 incorrectamente', 'top-right', 'danger', 3000, 'close-outline');
        }
      }, (err) => {
        console.log(err);
      });
      

    }
  }

  compareSelect(a: {id_etiqueta: number}, b: {id_etiqueta: number}) {
    if (a.id_etiqueta === b.id_etiqueta) {
      return true;
    }
    return false;
  }

  showToast(titulo, subtitulo, position, status, duration, iconName) {
    this.toastrService.show(subtitulo, titulo, { position, status, duration, icon: iconName});
  }

  selectCodigo(event: CodigoEvento) {

    const index = this.dataSource.configuracion.findIndex( (code: any) => {
      return code.cod_evento === event.cod;
    } );
    // console.log(index);
    if (index === -1) {
      // console.log(event);
      // console.log(this.dataSource);
      this.codigoSeleccionado = event;
    } else {

      this.isDisabled = true;
      this.codigoSeleccionado = undefined;
      this.showToast('Evento ya existe en la configuración', '1 incorrectamente', 'top-right', 'danger', 3000, 'close-outline');
    }

  }

  selectEtiqueta(event: Etiqueta) {
    // console.log(event);
    this.etiquetaSeleccionado = event;
    const fechaUtc =  String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));

    if (this.codigoSeleccionado !== undefined) {

      const index = this.dataSource.configuracion.findIndex( (code: any) => {
        return code.cod_evento === this.codigoSeleccionado.cod;
      } );

      if (index === -1) {
        this.isDisabled = false;
        console.log(this.dataSource.cod_configuracion);
        console.log(this.codigoSeleccionado.cod);
        console.log(this.etiquetaSeleccionado.id_etiqueta);
        console.log(this.etiquetaSeleccionado.nombre);
        console.log(this.etiquetaSeleccionado.fotografia);
        console.log(fechaUtc);

      }

    }

  }

  agregarItemConfiguracion() {

    const fechaUtc =  String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));


    console.log('AGREGAR ITEM CONFIGURACION: ', this.etiquetaSeleccionado);
    this.restService.agregarEventoConfiguracion(
        this.dataSource.cod_configuracion,
        this.codigoSeleccionado.cod,
        this.etiquetaSeleccionado.id_etiqueta,
        this.etiquetaSeleccionado.nombre,
        this.etiquetaSeleccionado.fotografia,
        fechaUtc,
        this.etiquetaSeleccionado.icono,
        this.etiquetaSeleccionado.nombre_icono,
        this.etiquetaSeleccionado.descripcion_icono,
        this.etiquetaSeleccionado.color_icono
    ).subscribe((res) => {
            console.log(res);
            // tslint:disable-next-line: no-string-literal
            if (res['affectedRows'] === 1) {
                this.showToast('Etiqueta agregada', '1 correctamente', 'top-right', 'success', 3000, 'checkmark-outline');

                const confE = {
                    id: 0,
                    cod_configuracion: this.dataSource.cod_configuracion,
                    cod_evento: this.codigoSeleccionado.cod,
                    id_etiqueta: 0,
                    etiqueta: this.etiquetaSeleccionado.nombre,
                    fotografia: this.etiquetaSeleccionado.fotografia
                };

            } else {
                this.showToast('Etiqueta NO agregada', '1 incorrectamente', 'top-right', 'danger', 3000, 'close-outline');
            }
    }, (err) => {
        console.log(err);
    });
  }

  eliminarEtiquetaConfiguracion(event) {
    console.log(event);

    this.restService.eliminarEtiquetaConfiguracion(event).subscribe((res) => {
      console.log(res);
      this.showToast('Etiqueta agregada', '1 correctamente', 'top-right', 'success', 3000, 'checkmark-outline');
      // tslint:disable-next-line: no-string-literal

    }, (err) => {
      console.log(err);
      this.showToast('Etiqueta NO agregada', '1 incorrectamente', 'top-right', 'danger', 3000, 'close-outline');
    });
  }

  cambiarNombreConfiguracionEtiqueta() {
    this.spinnerActualizar = 1;
    console.log('codigo configuración: ', this.data.cod_configuracion);
    console.log('nuevo nombre: ', this.data.nombre);
    this.restService.actualizarNombreConfiguracionEtiqueta(this.data.cod_configuracion, this.data.nombre).subscribe((res) => {
      console.log(res);
      this.openSnackBar('Nombre de configuracion actualizado correctamente', 'ok');
      this.spinnerActualizar = 0;
    }, (err) => {
      console.log(err);
      this.openSnackBar('No se ha podido completar la operación', 'ok');
    });
  }

  openSnackBar(mensaje: any, action: string) {
    this._snackBar.open(mensaje, action, {
      duration: 3000,
    });
}

}
