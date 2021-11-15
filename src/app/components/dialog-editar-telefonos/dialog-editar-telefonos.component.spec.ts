import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarTelefonosComponent } from './dialog-editar-telefonos.component';

describe('DialogEditarTelefonosComponent', () => {
  let component: DialogEditarTelefonosComponent;
  let fixture: ComponentFixture<DialogEditarTelefonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarTelefonosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarTelefonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
