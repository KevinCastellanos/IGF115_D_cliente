import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVerGeocercasTriggersTelegramComponent } from './dialog-ver-geocercas-triggers-telegram.component';

describe('DialogVerGeocercasTriggersTelegramComponent', () => {
  let component: DialogVerGeocercasTriggersTelegramComponent;
  let fixture: ComponentFixture<DialogVerGeocercasTriggersTelegramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVerGeocercasTriggersTelegramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerGeocercasTriggersTelegramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
