import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Vehiculo } from '../../interfaces/vehiculo';
import { Device } from '../../interfaces/device';

@Component({
  selector: 'app-dialog-detalle-vehiculo',
  templateUrl: './dialog-detalle-vehiculo.component.html',
  styleUrls: ['./dialog-detalle-vehiculo.component.css']
})
export class DialogDetalleVehiculoComponent implements OnInit {

    public infoVehiculo: Vehiculo = {
        id_vehiculo: 0,
        id_dispositivo: 0,
        id_master: 0,
        id_usuario: 0,
        imei: '',
        nombre: '',
        rxart: '',
        interface: '',
        imsi: '',
        operador: '',
        id_sim: '',
        version: '',
        registrado: '',
        year_vehicle: '',
        marca: '',
        modelo: '',
        placa: '',
        color: '',
        vin: '',
        descripcion: '',
        asociado: ''
    };

    public dispositivo: Device;

    public loaderVehiculos = true;
    constructor(public dialogRef: MatDialogRef<DialogDetalleVehiculoComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit(): void {
        // console.log('imei seleccionado: ', this.data.imei);
        const disp = this.localStorageService.vehiculos.find((d) => d.imei == this.data.imei);
        if(disp) {
            // console.log('disp: ', disp); 
            this.dispositivo = disp;
        }
        
        this.obtenerdatosVehiculo(this.data.imei);
    }

    obtenerdatosVehiculo(imei: string) {
        this.restService.obtenerVehiculo(imei).subscribe((data) =>{
            
            this.infoVehiculo = data;
            this.loaderVehiculos = false;
        }, (err) => {
            console.log(err);
        });

        this.restService.obtenerDatosVehiculo(imei).subscribe((data) => {
            // console.log(data);
            this.dispositivo.nombre_script = data.nombre_script;
    
        }, (error) => {
            console.log(error);
        });
    }

    cString(value) {
        return String(value);
    }

}
