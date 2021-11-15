import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarEtiquetaComponent } from './editar-etiqueta.component';

describe('EditarEtiquetaComponent', () => {
  let component: EditarEtiquetaComponent;
  let fixture: ComponentFixture<EditarEtiquetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEtiquetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEtiquetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
