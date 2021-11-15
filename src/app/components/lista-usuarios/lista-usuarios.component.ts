import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  usuariosActivosObs: Observable<any>;

  constructor(public chatService: ChatService) { }

  ngOnInit() {
    this.usuariosActivosObs = this.chatService.getUsuariosActivos();

    // emitir el obtener usuarios activos
    this.chatService.emitirUsuariosActivos();
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
