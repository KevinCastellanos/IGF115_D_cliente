import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogVerVehiculosTriggersComponent } from './dialog-ver-vehiculos-triggers.component';

describe('DialogVerVehiculosTriggersComponent', () => {
  let component: DialogVerVehiculosTriggersComponent;
  let fixture: ComponentFixture<DialogVerVehiculosTriggersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogVerVehiculosTriggersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerVehiculosTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
