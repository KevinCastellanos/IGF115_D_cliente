import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogColeccionComponent } from './dialog-coleccion.component';

describe('DialogColeccionComponent', () => {
  let component: DialogColeccionComponent;
  let fixture: ComponentFixture<DialogColeccionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
