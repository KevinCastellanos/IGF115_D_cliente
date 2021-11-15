import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { LocalStorageService } from './local-storage.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  idVehiculos = '';
  arrayID: any = [];

  constructor(public wsService: WebsocketService,
              private localStorageService: LocalStorageService,
              private dataService: DataService) {
    this.idVehiculos = '';
  }

  sendMessage(mensaje: string) {

    // tslint:disable-next-line: only-arrow-functions
    let indice = 0;
    for (indice; indice < this.arrayID.length; indice++ ) {
      this.idVehiculos = this.idVehiculos + ' ' + this.arrayID[indice];
    }
    // El payload tiende a ser un objeto
    const payload = {
      de: this.localStorageService.getUsuario().nombre,
      cuerpo: mensaje,
      vehiculos: this.idVehiculos
    };

    this.wsService.emit('mensaje', payload);

    this.idVehiculos = '';
    this.arrayID = [];
  }

  enviarComandos(mensaje: any, imei: string, idCon: number, consola: boolean) {

    const payload = {
      id: Number(this.dataService.generadorIdNumber()),
      de: this.localStorageService.usuario.usuario.nombre + ' ' + this.localStorageService.usuario.usuario.apellido,
      comandos: mensaje,
      imei: imei,
      idConexion: idCon,
      consola
    };

    this.wsService.emit('mensaje-consola', payload);
  }

  enviarcomandosConfiguracion(mensaje: any, imei: string, idCon: number, consola: boolean) {

    const payload = {
      id: Number(this.dataService.generadorIdNumber()),
      de: 'nombre',
      comandos: mensaje,
      imei: imei,
      idConexion: idCon,
      consola
    };

    this.wsService.emit('mensaje-consola-configuracion', payload);
  }

  getMessage() {
    // está escuchando eventos del servidor
    return this.wsService.listen('mensaje-nuevo');
  }

  obtenerRespuestaConsola() {
    return this.wsService.listen('mensaje-respuesta');
  }

  agregarIdVehiculos(id: string) {

    this.arrayID.push(id);

  }

  quitarIdVehiculos(id) {
    const index = this.arrayID.indexOf(id);
    if (index > -1) {
      this.arrayID.splice(index, 1);
    }
  }

  // Obtener mensaje privado
  getMessagesPrivate() {
    // esta escuchando eventos del servidor
    return this.wsService.listen('mensaje-privado');
  }

  getUsuariosActivos() {
    return this.wsService.listen('usuarios-activos');
  }

  emitirUsuariosActivos() {
    this.wsService.emit('obtener-usuarios');
  }
}
