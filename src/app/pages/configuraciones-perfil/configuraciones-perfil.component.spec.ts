import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfiguracionesPerfilComponent } from './configuraciones-perfil.component';

describe('ConfiguracionesPerfilComponent', () => {
  let component: ConfiguracionesPerfilComponent;
  let fixture: ComponentFixture<ConfiguracionesPerfilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionesPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
