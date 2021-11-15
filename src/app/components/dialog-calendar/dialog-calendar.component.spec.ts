import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogCalendarComponent } from './dialog-calendar.component';

describe('DialogCalendarComponent', () => {
  let component: DialogCalendarComponent;
  let fixture: ComponentFixture<DialogCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
