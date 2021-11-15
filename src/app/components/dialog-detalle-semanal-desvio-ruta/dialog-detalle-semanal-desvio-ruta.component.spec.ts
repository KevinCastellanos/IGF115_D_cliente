import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleSemanalDesvioRutaComponent } from './dialog-detalle-semanal-desvio-ruta.component';

describe('DialogDetalleSemanalDesvioRutaComponent', () => {
  let component: DialogDetalleSemanalDesvioRutaComponent;
  let fixture: ComponentFixture<DialogDetalleSemanalDesvioRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleSemanalDesvioRutaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleSemanalDesvioRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
