import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleVelocidadComponent } from './dialog-detalle-velocidad.component';

describe('DialogDetalleVelocidadComponent', () => {
  let component: DialogDetalleVelocidadComponent;
  let fixture: ComponentFixture<DialogDetalleVelocidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleVelocidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleVelocidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
