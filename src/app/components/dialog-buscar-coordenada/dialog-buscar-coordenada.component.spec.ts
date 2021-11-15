import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogBuscarCoordenadaComponent } from './dialog-buscar-coordenada.component';

describe('DialogBuscarCoordenadaComponent', () => {
  let component: DialogBuscarCoordenadaComponent;
  let fixture: ComponentFixture<DialogBuscarCoordenadaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBuscarCoordenadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBuscarCoordenadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
