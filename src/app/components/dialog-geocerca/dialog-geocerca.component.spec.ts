import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogGeocercaComponent } from './dialog-geocerca.component';

describe('DialogGeocercaComponent', () => {
  let component: DialogGeocercaComponent;
  let fixture: ComponentFixture<DialogGeocercaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGeocercaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGeocercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
