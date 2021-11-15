import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogListComandosComponent } from './dialog-list-comandos.component';

describe('DialogListComandosComponent', () => {
  let component: DialogListComandosComponent;
  let fixture: ComponentFixture<DialogListComandosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogListComandosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogListComandosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
