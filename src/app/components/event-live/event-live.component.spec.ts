import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventLiveComponent } from './event-live.component';

describe('EventLiveComponent', () => {
  let component: EventLiveComponent;
  let fixture: ComponentFixture<EventLiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
