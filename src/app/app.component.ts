import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestService } from './services/rest.service';
import {Howl, Howler} from 'howler';
import { NavigationEnd, Router } from '@angular/router';

declare let gtag: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'basico';
    private available: boolean = false;
    readonly VAPID_PUBLIC_KEY = 'BHhwt0tT0XtG9goZiYRMQtQiKgSbxS8UZFSeNeAwQFSWWdL966dVWkJR-AmqwmJMbSaXgxMsf-J-QAu3CD-kW60';

    constructor(private update: SwUpdate,
                private push: SwPush,
                private snackbar: MatSnackBar,
                private restService: RestService,
                public router: Router) {
        
        this.router.events.subscribe(event => {
            if(event instanceof NavigationEnd){
                gtag('config', 'UA-140189102-1', 
                        {
                            'page_path': event.urlAfterRedirects
                        }
                    );
                }
            }
        );

    }

    // app.component.ts siempre esta corriendo en toda la aplicacion por eso
    // es buen lugar para poner codigo que esten corriendo siempre
    ngOnInit() {

        if (this.update.isEnabled) {
            // console.log('nueva actualizacion:');
            // metodo 1 para chequear actualizacion
            this.chequearActualizacion();

            // verificar actualizaciones en la pagina
            this.checkForUpdate();

            // subscribirse a las notificaciones
            // this.subscribirseNotificacion();

            // recibir notifiacion una vez estando en subscripcion
            // this.recibirNotificaciones();

            // this.susbripcionesActiva();
        }

        // this.sonidoRepetitivo();
    }

    checkForUpdate() {
        if (this.update.isEnabled) {
          this.update.checkForUpdate().then(() => {
              // console.log('Checking for updates...');
          }).catch((err) => {
              console.error('Error when checking for update', err);
          });
        }
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

    recibirNotificaciones() {
        // push notification mensaje
        this.push.messages.subscribe(msg => {
            // console.log('push notification: ', msg);
            this.snackbar.open(JSON.stringify(msg), 'ok', {
              duration: 5000,
            });
            const sound = new Howl({
                src: ['./assets/sound/viridian.mp3']
            });
            sound.play();
        });
    }

    chequearActualizacion() {
        this.update.available.subscribe(updates => {
            // console.log('hay actualizacion existente', updates);

            const snack = this.snackbar.open('Actualización disponible', 'Recargar');
            
            snack.onAction().subscribe(() => {
                window.location.reload();
            });
            
            const sound = new Howl({
                src: ['./assets/sound/viridian.mp3']
            });
            sound.play();
        });
    }

    susbripcionesActiva() {
        // We need the service worker registration to check for a subscription
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {

                // Enable any UI which subscribes / unsubscribes from
                // console.log('Subscripcion Activa: ', subscription);

            }).catch(function(err) {
                console.log('Error during getSubscription()', err);
            });
        });
    }

    sonidoRepetitivo() {
        const sound = new Howl({
            src: ['./assets/sound/beep_3.mp3'],
            autoplay: true,
            loop: true,
        });
        // sound.play();
        
    }
}
