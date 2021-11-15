import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogResumenComponent } from './dialog-resumen.component';

describe('DialogResumenComponent', () => {
  let component: DialogResumenComponent;
  let fixture: ComponentFixture<DialogResumenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
