import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogAtenderNotificacionComponent } from './dialog-atender-notificacion.component';

describe('DialogAtenderNotificacionComponent', () => {
  let component: DialogAtenderNotificacionComponent;
  let fixture: ComponentFixture<DialogAtenderNotificacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAtenderNotificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAtenderNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
