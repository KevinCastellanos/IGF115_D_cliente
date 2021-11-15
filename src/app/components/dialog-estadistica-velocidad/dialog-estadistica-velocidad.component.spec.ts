import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEstadisticaVelocidadComponent } from './dialog-estadistica-velocidad.component';

describe('DialogEstadisticaVelocidadComponent', () => {
  let component: DialogEstadisticaVelocidadComponent;
  let fixture: ComponentFixture<DialogEstadisticaVelocidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEstadisticaVelocidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEstadisticaVelocidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
