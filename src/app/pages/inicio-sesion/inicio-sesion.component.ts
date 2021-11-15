import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import {Howl, Howler} from 'howler';
import { SwPush } from '@angular/service-worker';

import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  hide = true;
  usuario = '';
  pass = '';
  visible = 0;

  public id: string;

  readonly VAPID_PUBLIC_KEY = 'BHhwt0tT0XtG9goZiYRMQtQiKgSbxS8UZFSeNeAwQFSWWdL966dVWkJR-AmqwmJMbSaXgxMsf-J-QAu3CD-kW60';

    constructor(private localStorageService: LocalStorageService,
                private route: Router,
                private dialog: MatDialog,
                private restService: RestService,
                private push: SwPush,
                private route2: ActivatedRoute,
                public wsService: WebsocketService) {

        console.log('id recibido por url: ', this.route2.snapshot.paramMap.get('id'));
        console.log('id por url: ', this.route2.snapshot.params['user']);
        console.log('id por url: ', this.route2.snapshot.params['pwd']);

        if (this.route2.snapshot.params['user'] !== undefined && this.route2.snapshot.params['pwd'] !== undefined) {
            this.usuario =  this.route2.snapshot.params['user'];
            this.pass = this.route2.snapshot.params['pwd'];
            console.log('usuario y pass: ', this.usuario, this.pass);
            this.ingresar();
        }

        if (this.localStorageService.getUsuario()) {
            // console.log('hay usuario regitrado');
            this.route.navigateByUrl('/principal');

            // estatico por el momento
        }
    }

    ngOnInit() {
    }

    ingresar() {
        this.visible = 1;
        this.restService.login(this.usuario, this.pass).subscribe((response) => {
            console.log('login: ', response);
            // tslint:disable-next-line: no-string-literal
            if (response['token'] !== undefined) {
                this.visible = 0;
                // console.log('entro a sesion');

                if (response['usuario'].status === 1) {
                    // guardamos la sesion en el localStorage
                    this.localStorageService.loginWS(this.usuario, response);
                    this.localStorageService.guardarVistaViaje(response['usuario'].vista_viaje);
                    this.obtenerTextoIdioma(response['usuario'].idioma);
                    
                } else {
                    this.openDialog('Error', 'Contácte al departamento de contabilidad');
                }

            } else {
                this.openDialog('Error', 'Credenciales incorrecta, intente de nuevo');
            }
        }, (err) => {
            this.visible = 0;
            // console.log('Detalle error: ', error);
            // tslint:disable-next-line: max-line-length
            this.openDialog('Error fatal: 422', 'El servidor no puede responder a la petición, intente mas tarde, si la falla persiste contacte a soporte');
        });
    }



    openDialog(title: string, body: string) {


        const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {
            title,
            body
        }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    desubscribirse() {
        this.push.unsubscribe().then((data) => {
            // console.log('desuscribirse', data);
        }).catch( (err) => {
            // console.log('ocurrio algo: ', err);
        });

        this.push.subscription.toPromise().then((data) => {
            // console.log('desubcripcion manual', data);
        }).catch((err) => {
            console.log(err);
        });

        this.push.subscription.subscribe().unsubscribe();

    }

    subscribirseNotificacion() {
        // push con suscripcion
        this.push.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        }).then(sub => {
            // console.log('subscripcion notification');
            // console.log(sub);
            this.restService.addPushSubscriber(sub).subscribe();
        }).catch(err => {
            console.error('Could not subscribe to notifications', err);
        });
    }

    obtenerTextoIdioma(language) {
        // console.log('lenguaje seleccionado del usuario: ', language);
        this.restService.obtenerTextoIdioma(language).subscribe((data) => {
            // console.log(data);
            this.localStorageService.guardarLenguaje(data);
            this.obtenerTextoIdiomaEs();
        }, (err) => {
            console.log(err);
        });
    }

    obtenerTextoIdiomaEs() {
        this.restService.obtenerTextoIdioma('es').subscribe((data) => {
            // console.log(data);
            this.localStorageService.guardarLenguajeEs(data);
            this.route.navigateByUrl('/principal');
        }, (err) => {
            console.log(err);
        });
    }

    abonarSaldo() {
        
    }
}
