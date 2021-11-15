import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogResumenViajeComponent } from './dialog-resumen-viaje.component';

describe('DialogResumenViajeComponent', () => {
  let component: DialogResumenViajeComponent;
  let fixture: ComponentFixture<DialogResumenViajeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResumenViajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResumenViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
