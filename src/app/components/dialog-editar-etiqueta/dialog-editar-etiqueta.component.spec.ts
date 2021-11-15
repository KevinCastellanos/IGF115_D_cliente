import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogEditarEtiquetaComponent } from './dialog-editar-etiqueta.component';

describe('DialogEditarEtiquetaComponent', () => {
  let component: DialogEditarEtiquetaComponent;
  let fixture: ComponentFixture<DialogEditarEtiquetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarEtiquetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarEtiquetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
