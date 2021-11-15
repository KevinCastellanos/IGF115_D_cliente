import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogConductoresActivosComponent } from './dialog-conductores-activos.component';

describe('DialogConductoresActivosComponent', () => {
  let component: DialogConductoresActivosComponent;
  let fixture: ComponentFixture<DialogConductoresActivosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConductoresActivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConductoresActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
