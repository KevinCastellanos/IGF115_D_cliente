import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogBuscarGeocercaComponent } from './dialog-buscar-geocerca.component';

describe('DialogBuscarGeocercaComponent', () => {
  let component: DialogBuscarGeocercaComponent;
  let fixture: ComponentFixture<DialogBuscarGeocercaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBuscarGeocercaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBuscarGeocercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
