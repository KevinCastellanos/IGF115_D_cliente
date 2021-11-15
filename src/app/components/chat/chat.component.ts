import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  texto = '';
  mensajeSubscription: Subscription;
  mensajes: any[] = [];
  elemento: HTMLElement;
  usuariosActivosObs: Observable<any>;
  public ch = false;

  constructor(public chatService: ChatService) { }

  ngOnInit() {

    this.usuariosActivosObs = this.chatService.getUsuariosActivos();

    // emitir el obtener usuarios activos
    this.chatService.emitirUsuariosActivos();

    this.elemento = document.getElementById('chat-mensaje');

    this.mensajeSubscription = this.chatService.getMessage().subscribe(msg => {
      console.log(msg);
      this.mensajes.push(msg);
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 50);
    });
  }

  ngOnDestroy() {
    this.mensajeSubscription.unsubscribe();
  }

  enviar() {

    if (this.texto.trim().length === 0) {
      return;
    }
    console.log(this.texto);

    this.chatService.sendMessage(this.texto);
    this.texto = '';
    this.ch = false;
  }

  changeStatus(id, event) {
    console.log('ID: ', id);
    console.log('Evento del checkbox: ', event.target.checked);

    if (event.target.checked === true) {
      this.chatService.agregarIdVehiculos(id);
    } else {
      this.chatService.quitarIdVehiculos(id);
    }
  }

}
