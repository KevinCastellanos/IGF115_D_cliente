import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogConfirmAddressComponent } from './dialog-confirm-address.component';

describe('DialogConfirmAddressComponent', () => {
  let component: DialogConfirmAddressComponent;
  let fixture: ComponentFixture<DialogConfirmAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
