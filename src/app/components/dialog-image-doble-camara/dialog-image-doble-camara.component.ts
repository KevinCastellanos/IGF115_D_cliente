import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dialog-image-doble-camara',
  templateUrl: './dialog-image-doble-camara.component.html',
  styleUrls: ['./dialog-image-doble-camara.component.css']
})
export class DialogImageDobleCamaraComponent implements OnInit {
    public image1 = '/assets/cargando.gif';
    public image2 = '/assets/cargando.gif';
    public image3 = '/assets/cargando.gif';

    public imageNoDisponible = '/assets/imagen_no_disponible.png';

    constructor(public dialogRef: MatDialogRef<DialogImageDobleCamaraComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public restService: RestService) { }

    ngOnInit() {
        // console.log(this.data);
        switch(this.data.modulo) {
            case 1:
                this.obtenerFotosMonitoreo(this.data.evento, this.data.imei);
                break;
            case 2:
                this.obtenerFotosViajes(this.data.evento, this.data.imei);
                break;
        }
        
    }

    obtenerFotosViajes(evento, imei) {

        // obtenemos la primera imagen
        this.restService.obtenerImagen(imei, evento.PS01).subscribe((data1) => {
            console.log('imagen 1',data1);
            if (data1['ok'] === true) {
                this.image1 = data1['data'];
            } else {
                this.image1 = this.imageNoDisponible
            }
            
            // obtenemos la segunda imagen
            this.restService.obtenerImagen(imei, evento.PS02).subscribe((data2) => {
                // console.log('imagen 2',data);
                if (data1['ok'] === true) {
                    this.image2 = data2['data'];
                } else {
                    this.image2 = this.imageNoDisponible
                }

                // obtenemos la tercera imagen
                this.restService.obtenerImagen(imei, evento.PS03).subscribe((data3) => {
                    // console.log('imagen 2',data);
                    if (data1['ok'] === true) {
                        this.image3 = data3['data'];
                    } else {
                        this.image3 = this.imageNoDisponible
                    }
                    
                }, (error) => {
                    console.log(error);
                    this.image3 = this.imageNoDisponible
                });
                
            }, (error) => {
                console.log(error);
                this.image2 = this.imageNoDisponible
            });

        }, (error) => {
            console.log(error);
            this.image1 = this.imageNoDisponible
        });
    }

    obtenerFotosMonitoreo(evento, imei) {

        // obtenemos la primera imagen
        this.restService.obtenerImagen(imei, evento.PS01).subscribe((data1) => {
            // console.log('imagen 1',data1);
            if (data1['ok'] === true) {
                this.image1 = data1['data'];
            } else {
                this.image1 = this.imageNoDisponible
            }
            
            // obtenemos la segunda imagen
            this.restService.obtenerImagen(imei, evento.PS02).subscribe((data2) => {
                // console.log('imagen 2',data);
                if (data1['ok'] === true) {
                    this.image2 = data2['data'];
                } else {
                    this.image2 = this.imageNoDisponible
                }

                // obtenemos la tercera imagen
                this.restService.obtenerImagen(imei, evento.ps03).subscribe((data3) => {
                    // console.log('imagen 2',data);
                    if (data1['ok'] === true) {
                        this.image3 = data3['data'];
                    } else {
                        this.image3 = this.imageNoDisponible
                    }
                    
                }, (error) => {
                    console.log(error);
                    this.image3 = this.imageNoDisponible
                });
                
            }, (error) => {
                console.log(error);
                this.image2 = this.imageNoDisponible
            });

        }, (error) => {
            console.log(error);
            this.image1 = this.imageNoDisponible
        });
    }

}
