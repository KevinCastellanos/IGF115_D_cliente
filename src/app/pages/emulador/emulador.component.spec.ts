import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmuladorComponent } from './emulador.component';

describe('EmuladorComponent', () => {
  let component: EmuladorComponent;
  let fixture: ComponentFixture<EmuladorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmuladorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmuladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
