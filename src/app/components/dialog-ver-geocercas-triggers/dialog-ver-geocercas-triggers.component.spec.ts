import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogVerGeocercasTriggersComponent } from './dialog-ver-geocercas-triggers.component';

describe('DialogVerGeocercasTriggersComponent', () => {
  let component: DialogVerGeocercasTriggersComponent;
  let fixture: ComponentFixture<DialogVerGeocercasTriggersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogVerGeocercasTriggersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerGeocercasTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
