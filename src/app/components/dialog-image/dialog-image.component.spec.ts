import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogImageComponent } from './dialog-image.component';

describe('DialogImageComponent', () => {
  let component: DialogImageComponent;
  let fixture: ComponentFixture<DialogImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
