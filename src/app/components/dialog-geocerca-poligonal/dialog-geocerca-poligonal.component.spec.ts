import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogGeocercaPoligonalComponent } from './dialog-geocerca-poligonal.component';

describe('DialogGeocercaPoligonalComponent', () => {
  let component: DialogGeocercaPoligonalComponent;
  let fixture: ComponentFixture<DialogGeocercaPoligonalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGeocercaPoligonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGeocercaPoligonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
