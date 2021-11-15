import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogEditarGrupoComponent } from './dialog-editar-grupo.component';

describe('DialogEditarGrupoComponent', () => {
  let component: DialogEditarGrupoComponent;
  let fixture: ComponentFixture<DialogEditarGrupoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
