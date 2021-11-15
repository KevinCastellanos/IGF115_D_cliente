import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVerVehiculosTriggersTelegramComponent } from './dialog-ver-vehiculos-triggers-telegram.component';

describe('DialogVerVehiculosTriggersTelegramComponent', () => {
  let component: DialogVerVehiculosTriggersTelegramComponent;
  let fixture: ComponentFixture<DialogVerVehiculosTriggersTelegramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVerVehiculosTriggersTelegramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerVehiculosTriggersTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
