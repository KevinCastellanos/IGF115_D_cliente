import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogRutasConductoresComponent } from './dialog-rutas-conductores.component';

describe('DialogRutasConductoresComponent', () => {
  let component: DialogRutasConductoresComponent;
  let fixture: ComponentFixture<DialogRutasConductoresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRutasConductoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRutasConductoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
