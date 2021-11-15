import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogGeocercaFueraRutaComponent } from './dialog-geocerca-fuera-ruta.component';

describe('DialogGeocercaFueraRutaComponent', () => {
  let component: DialogGeocercaFueraRutaComponent;
  let fixture: ComponentFixture<DialogGeocercaFueraRutaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGeocercaFueraRutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGeocercaFueraRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
