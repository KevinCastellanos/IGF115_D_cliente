import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditorDetallesComponent } from './dialog-auditor-detalles.component';

describe('DialogAuditorDetallesComponent', () => {
  let component: DialogAuditorDetallesComponent;
  let fixture: ComponentFixture<DialogAuditorDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditorDetallesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditorDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
