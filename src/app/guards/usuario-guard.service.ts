import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RestService } from '../services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuardService implements CanActivate {

  constructor(public localStorageService: LocalStorageService,
              private router: Router,
              private restService: RestService) { }

  canActivate() {

    if (this.localStorageService.getUsuario() && this.localStorageService.usuario.usuario.status === 1) {
      // console.log('hay usuario regitrado');
      // this.router.navigateByUrl('/monitoreo');
      // console.log(this.localStorageService.getUsuario());

      let usuario = this.localStorageService.getUsuario();

      this.restService.obtenerIdGrupos(usuario.usuario.id_usuario).subscribe((data) => {
        // console.log(data);

        let groups: any[] = [];
        // tslint:disable-next-line: forin
        for (let i in data) {
          groups.push(data[i].id_grupo);
        }
        // console.log('IDS: ', groups);

        // actualizamos la data local de grupos
        usuario.usuario.grupos = groups;

        // guardamos los cambios efectuados
        this.localStorageService.guardarStorage(usuario);
      }, (err) => {
        console.log(err);
      });


      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
