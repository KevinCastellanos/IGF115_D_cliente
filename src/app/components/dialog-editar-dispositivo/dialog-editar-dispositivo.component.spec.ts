import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogEditarDispositivoComponent } from './dialog-editar-dispositivo.component';

describe('DialogEditarDispositivoComponent', () => {
  let component: DialogEditarDispositivoComponent;
  let fixture: ComponentFixture<DialogEditarDispositivoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarDispositivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
