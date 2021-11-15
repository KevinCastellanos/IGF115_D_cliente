import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCorreosTriggerComponent } from './editar-correos-trigger.component';

describe('EditarCorreosTriggerComponent', () => {
  let component: EditarCorreosTriggerComponent;
  let fixture: ComponentFixture<EditarCorreosTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCorreosTriggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCorreosTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
