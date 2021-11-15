import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogEtiquetaComponent } from './dialog-etiqueta.component';

describe('DialogEtiquetaComponent', () => {
  let component: DialogEtiquetaComponent;
  let fixture: ComponentFixture<DialogEtiquetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEtiquetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEtiquetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
