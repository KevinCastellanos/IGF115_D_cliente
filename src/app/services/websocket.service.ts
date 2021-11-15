import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  public config: SocketIoConfig = {
    url: 'https://aps.tkontrol.com',
    options: {
      autoConnect: false,
      path: '/srv1'
    }
  };

  constructor(private socket: Socket) {

  }

  checkStatus(grupos) {
    // son observable
    this.socket.on('connect', () => {
      console.log('conectado al servidor');
      this.socketStatus = true;
      this.emit('configurar-usuario', {grupos});
      // this.cargarStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });
  }

  // método que sirve para ser reutilizable los metodos en toda la aplicación
  // ? -> sirve para indicar que puede o no ir en los argumentos del metodo
  emit(event: string, payload?: any, callback?: Function) {

    // console.log('Emitiendo: ', event);
    this.socket.emit(event, payload, callback);
  }

  listen(event: string) {
    // recibe un observable
    return this.socket.fromEvent(event);
  }

  // optimización:: parar la escucha de socket mientras no se usa

  conectarWs() {
    this.socket.connect();
  }

  desconectarWs() {
    this.socket.disconnect();
  }

  changeToAdminSocket(urlSocket: any) {
    // console.log('cambiar ip socket: ');
    
    this.socket.disconnect();

    this.config.url = urlSocket.url; // Note the port change
    this.config.options.path = urlSocket.path; // path

    this.socket = new Socket(this.config);

  }
}
