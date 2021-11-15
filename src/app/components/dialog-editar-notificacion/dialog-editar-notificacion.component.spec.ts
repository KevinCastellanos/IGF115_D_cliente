import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogEditarNotificacionComponent } from './dialog-editar-notificacion.component';

describe('DialogEditarNotificacionComponent', () => {
  let component: DialogEditarNotificacionComponent;
  let fixture: ComponentFixture<DialogEditarNotificacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarNotificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
