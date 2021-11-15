import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogImageDobleCamaraComponent } from './dialog-image-doble-camara.component';

describe('DialogImageDobleCamaraComponent', () => {
  let component: DialogImageDobleCamaraComponent;
  let fixture: ComponentFixture<DialogImageDobleCamaraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogImageDobleCamaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImageDobleCamaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
