import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogVerGeocercasComponent } from './dialog-ver-geocercas.component';

describe('DialogVerGeocercasComponent', () => {
  let component: DialogVerGeocercasComponent;
  let fixture: ComponentFixture<DialogVerGeocercasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogVerGeocercasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerGeocercasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
