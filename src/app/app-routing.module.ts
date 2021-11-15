import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioGuardService } from './guards/usuario-guard.service';
import { GruposComponent } from './pages/grupos/grupos.component';
import { ConfigurarVehiculoComponent } from './pages/configurar-vehiculo/configurar-vehiculo.component';
import { EtiquetasComponent } from './pages/etiquetas/etiquetas.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo.component';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { ConductoresComponent } from './pages/conductores/conductores.component';
import { ConfiguracionesPerfilComponent } from './pages/configuraciones-perfil/configuraciones-perfil.component';
import { EmuladorComponent } from './pages/emulador/emulador.component';

const appRoutes: Routes = [
  {
    path: '',
    component: InicioSesionComponent
  },
  {
    path: 'grupos',
    component: GruposComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: 'monitoreo',
    component: MonitoreoComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: 'registrar-vehiculo',
    component: ConfigurarVehiculoComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: 'etiquetas',
    component: EtiquetasComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: 'conductores',
    component: ConductoresComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: 'configuracion-perfil',
    component: ConfiguracionesPerfilComponent,
    canActivate: [UsuarioGuardService]
  }
  ,
  {
    path: 'emulador',
    component: EmuladorComponent,
    canActivate: [UsuarioGuardService]
  },
  {
    path: '**',
    component: InicioSesionComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
