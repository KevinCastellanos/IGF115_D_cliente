import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogDetalleGeocercaComponent } from './dialog-detalle-geocerca.component';

describe('DialogDetalleGeocercaComponent', () => {
  let component: DialogDetalleGeocercaComponent;
  let fixture: ComponentFixture<DialogDetalleGeocercaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDetalleGeocercaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleGeocercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
