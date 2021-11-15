import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAgregarGeoRutaComponent } from './dialog-agregar-geo-ruta.component';

describe('DialogAgregarGeoRutaComponent', () => {
  let component: DialogAgregarGeoRutaComponent;
  let fixture: ComponentFixture<DialogAgregarGeoRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAgregarGeoRutaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAgregarGeoRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
