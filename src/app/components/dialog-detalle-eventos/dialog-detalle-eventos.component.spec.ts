import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogDetalleEventosComponent } from './dialog-detalle-eventos.component';

describe('DialogDetalleEventosComponent', () => {
  let component: DialogDetalleEventosComponent;
  let fixture: ComponentFixture<DialogDetalleEventosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDetalleEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
