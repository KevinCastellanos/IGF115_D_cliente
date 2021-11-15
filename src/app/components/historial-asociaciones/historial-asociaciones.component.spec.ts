import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAsociacionesComponent } from './historial-asociaciones.component';

describe('HistorialAsociacionesComponent', () => {
  let component: HistorialAsociacionesComponent;
  let fixture: ComponentFixture<HistorialAsociacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialAsociacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialAsociacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
