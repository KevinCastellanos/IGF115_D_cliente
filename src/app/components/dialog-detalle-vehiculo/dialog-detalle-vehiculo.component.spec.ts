import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleVehiculoComponent } from './dialog-detalle-vehiculo.component';

describe('DialogDetalleVehiculoComponent', () => {
  let component: DialogDetalleVehiculoComponent;
  let fixture: ComponentFixture<DialogDetalleVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
