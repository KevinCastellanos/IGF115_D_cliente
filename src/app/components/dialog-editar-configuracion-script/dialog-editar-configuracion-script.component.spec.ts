import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogEditarConfiguracionScriptComponent } from './dialog-editar-configuracion-script.component';

describe('DialogEditarConfiguracionScriptComponent', () => {
  let component: DialogEditarConfiguracionScriptComponent;
  let fixture: ComponentFixture<DialogEditarConfiguracionScriptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarConfiguracionScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarConfiguracionScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
