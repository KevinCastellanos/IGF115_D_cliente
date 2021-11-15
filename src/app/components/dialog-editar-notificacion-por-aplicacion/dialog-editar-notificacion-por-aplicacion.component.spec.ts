import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarNotificacionPorAplicacionComponent } from './dialog-editar-notificacion-por-aplicacion.component';

describe('DialogEditarNotificacionPorAplicacionComponent', () => {
  let component: DialogEditarNotificacionPorAplicacionComponent;
  let fixture: ComponentFixture<DialogEditarNotificacionPorAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarNotificacionPorAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarNotificacionPorAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
