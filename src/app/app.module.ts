import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Sockets
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import {CdkTableModule} from "@angular/cdk/table";


const config: SocketIoConfig = {
  url: 'http://localhost:5000',
  options: {
    autoConnect: false
  }
};

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatComponent } from './components/chat/chat.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { GruposComponent } from './pages/grupos/grupos.component';
import { EtiquetasComponent } from './pages/etiquetas/etiquetas.component';
import { ConfigurarVehiculoComponent } from './pages/configurar-vehiculo/configurar-vehiculo.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
// import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { DialogComponent } from './components/dialog/dialog.component';
// material angular
// import { MatFileUploadModule } from 'angular-material-fileupload';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
// import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatBadgeModule} from '@angular/material/badge';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
// import { TableVirtualScrollModule } from 'ng-cdk-table-virtual-scroll';

// nebular
import { NbThemeModule,
        NbCardModule,
        NbLayoutModule,
        NbToastrModule,
        NbThemeService,
        NbCalendarRangeModule,
        NbCalendarModule,
        NbListModule,
        NbChatModule,
        NbUserModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DialogCalendarComponent } from './components/dialog-calendar/dialog-calendar.component';
import { DetallesViajesComponent } from './components/detalles-viajes/detalles-viajes.component';
import { ListarVehiculosComponent } from './components/listar-vehiculos/listar-vehiculos.component';
import { DialogImageComponent } from './components/dialog-image/dialog-image.component';
import { DialogResumenComponent } from './components/dialog-resumen/dialog-resumen.component';
import { EventLiveComponent } from './components/event-live/event-live.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterImeiPipe } from './pipes/filter-imei.pipe';
import { HomeComponent } from './pages/home/home.component';
import { ContenedorComponent } from './components/contenedor/contenedor.component';
import { EditarEtiquetaComponent } from './components/editar-etiqueta/editar-etiqueta.component';
import { DialogEtiquetaComponent } from './components/dialog-etiqueta/dialog-etiqueta.component';
import { DialogEditarEtiquetaComponent } from './components/dialog-editar-etiqueta/dialog-editar-etiqueta.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DialogConfigComponent } from './components/dialog-config/dialog-config.component';
import { MaterialFileUploadComponent } from './components/material-file-upload/material-file-upload.component';
import { DialogListComandosComponent } from './components/dialog-list-comandos/dialog-list-comandos.component';
import { DialogColeccionComponent } from './components/dialog-coleccion/dialog-coleccion.component';
import { DialogGeocercaComponent } from './components/dialog-geocerca/dialog-geocerca.component';
import { DialogGeocercaPoligonalComponent } from './components/dialog-geocerca-poligonal/dialog-geocerca-poligonal.component';
import { DialogDetalleGeocercaComponent } from './components/dialog-detalle-geocerca/dialog-detalle-geocerca.component';
import { DistanciaPipe } from './pipes/distancia.pipe';
import { CantidadReversePipe } from './pipes/cantidad-reverse.pipe';
import { EsViajePipe } from './pipes/es-viaje.pipe';
import { DiferenciaHoraPipe } from './pipes/diferencia-hora.pipe';
import { ConvertAmPmPipe } from './pipes/convert-am-pm.pipe';
import { ConvertMiAKmPipe } from './pipes/convert-mi-a-km.pipe';
import { DialogResumenViajeComponent } from './components/dialog-resumen-viaje/dialog-resumen-viaje.component';
import { ObtenerDireccionPipe } from './pipes/obtener-direccion.pipe';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceWorkerModule, SwUpdate, SwPush } from '@angular/service-worker';
import { VisibilidadVehiculosComponent } from './components/visibilidad-vehiculos/visibilidad-vehiculos.component';
import { DialogEditarGrupoComponent } from './components/dialog-editar-grupo/dialog-editar-grupo.component';
import { ConvertUtcToLocalTimePipe } from './pipes/convert-utc-to-local-time.pipe';
import { DialogEditarDispositivoComponent } from './components/dialog-editar-dispositivo/dialog-editar-dispositivo.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo.component';
import { DialogBuscarCoordenadaComponent } from './components/dialog-buscar-coordenada/dialog-buscar-coordenada.component';
import { DialogVerGeocercasComponent } from './components/dialog-ver-geocercas/dialog-ver-geocercas.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { FilterGeocercaPipe } from './pipes/filter-geocerca.pipe';
import { FilterColeccionPipe } from './pipes/filter-coleccion.pipe';
import { DialogConfirmAddressComponent } from './components/dialog-confirm-address/dialog-confirm-address.component';
import { DialogEditarUsuarioComponent } from './components/dialog-editar-usuario/dialog-editar-usuario.component';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { DialogEditarNotificacionComponent } from './components/dialog-editar-notificacion/dialog-editar-notificacion.component';

import { DialogAtenderNotificacionComponent } from './components/dialog-atender-notificacion/dialog-atender-notificacion.component';
import { DuracionPipe } from './pipes/duracion.pipe';
import { PrincipalComponent } from './pages/principal/principal.component';
import { DialogEditarConfiguracionScriptComponent } from './components/dialog-editar-configuracion-script/dialog-editar-configuracion-script.component';
import { DialogVerVehiculosTriggersComponent } from './components/dialog-ver-vehiculos-triggers/dialog-ver-vehiculos-triggers.component';
import { DialogVerGeocercasTriggersComponent } from './components/dialog-ver-geocercas-triggers/dialog-ver-geocercas-triggers.component';
import { FilterDragPipe } from './pipes/filter-drag.pipe';
import { ConductoresComponent } from './pages/conductores/conductores.component';
import { GeocercasRutaComponent } from './components/geocercas-ruta/geocercas-ruta.component';
import { DialogGeocercaVisitadasComponent } from './components/dialog-geocerca-visitadas/dialog-geocerca-visitadas.component';
import { TraductorPipe } from './pipes/traductor.pipe';
import { DialogGeocercaFueraRutaComponent } from './components/dialog-geocerca-fuera-ruta/dialog-geocerca-fuera-ruta.component';
import { DialogBuscarGeocercaComponent } from './components/dialog-buscar-geocerca/dialog-buscar-geocerca.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { GalleryModule } from  '@ngx-gallery/core';
import { GALLERY_CONFIG } from '@ngx-gallery/core';
import { NombreBloqueoMotorPipe } from './pipes/nombre-bloqueo-motor.pipe';
import { NombreBloqueoSalida2Pipe } from './pipes/nombre-bloqueo-salida2.pipe';
import { SumatoriaVisitadaDentroRutaPipe } from './pipes/sumatoria-visitada-dentro-ruta.pipe';
import { SumatoriaVisitadaFueraRutaRefPipe } from './pipes/sumatoria-visitada-fuera-ruta-ref.pipe';
import { SumatoriaVisitadaFueraRutaNorefPipe } from './pipes/sumatoria-visitada-fuera-ruta-noref.pipe';
import { ConvertUtcToLocalDatePipe } from './pipes/convert-utc-to-local-date.pipe';
import { DialogConductoresActivosComponent } from './components/dialog-conductores-activos/dialog-conductores-activos.component';
import { DialogRutasConductoresComponent } from './components/dialog-rutas-conductores/dialog-rutas-conductores.component';
import { ConfiguracionesPerfilComponent } from './pages/configuraciones-perfil/configuraciones-perfil.component';
import { DialogImageDobleCamaraComponent } from './components/dialog-image-doble-camara/dialog-image-doble-camara.component';

import { MatVsTableModule } from 'mat-vs-table';
import { MatInputModule } from '@angular/material/input';
import { DialogAuditorDetallesComponent } from './components/dialog-auditor-detalles/dialog-auditor-detalles.component';
import { DialogAgregarGeoRutaComponent } from './components/dialog-agregar-geo-ruta/dialog-agregar-geo-ruta.component';
import { FilterGroupPipe } from './pipes/filter-group.pipe';
import { FilterDriverPipe } from './pipes/filter-driver.pipe';
import { StartDatePipe } from './pipes/start-date.pipe';
import { EndDatePipe } from './pipes/end-date.pipe';
import { ContadorDiasPipe } from './pipes/contador-dias.pipe';
import { ContadorDias2Pipe } from './pipes/contador-dias2.pipe';
import { ContadorDiasSumarioPipe } from './pipes/contador-dias-sumario.pipe';
import { ContadorDiasSumario2Pipe } from './pipes/contador-dias-sumario2.pipe';
import { DialogDetalleSemanalDesvioRutaComponent } from './components/dialog-detalle-semanal-desvio-ruta/dialog-detalle-semanal-desvio-ruta.component';
import { DialogDetalleVelocidadComponent } from './components/dialog-detalle-velocidad/dialog-detalle-velocidad.component';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { HistorialAsociacionesComponent } from './components/historial-asociaciones/historial-asociaciones.component';
import { DialogDetalleVehiculoComponent } from './components/dialog-detalle-vehiculo/dialog-detalle-vehiculo.component';
import { FilterEventosPipe } from './pipes/filter-eventos.pipe';
import { ConvertUtcToLocalTimeAmPmPipe } from './pipes/convert-utc-to-local-time-am-pm.pipe';
import { LabelParkingMovingPipe } from './pipes/label-parking-moving.pipe';
import { ConvertMAKmPipe } from './pipes/convert-m-a-km.pipe';
import { EditarCorreosTriggerComponent } from './components/editar-correos-trigger/editar-correos-trigger.component';
import { DialogEditarNotificacionPorAplicacionComponent } from './components/dialog-editar-notificacion-por-aplicacion/dialog-editar-notificacion-por-aplicacion.component';
import { DialogEstadisticaVelocidadComponent } from './components/dialog-estadistica-velocidad/dialog-estadistica-velocidad.component';
import { DialogGalleryComponent } from './components/dialog-gallery/dialog-gallery.component';
import { DialogEditarTelefonosComponent } from './components/dialog-editar-telefonos/dialog-editar-telefonos.component';
import { DialogVerVehiculosTriggersTelegramComponent } from './components/dialog-ver-vehiculos-triggers-telegram/dialog-ver-vehiculos-triggers-telegram.component';
import { DialogVerGeocercasTriggersTelegramComponent } from './components/dialog-ver-geocercas-triggers-telegram/dialog-ver-geocercas-triggers-telegram.component';
import { EditarColeccionComponent } from './components/editar-coleccion/editar-coleccion.component';
import { EmuladorComponent } from './pages/emulador/emulador.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ListaUsuariosComponent,
    GruposComponent,
    DialogComponent,
    ConfigurarVehiculoComponent,
    SidenavComponent,
    EtiquetasComponent,
    DialogCalendarComponent,
    DetallesViajesComponent,
    ListarVehiculosComponent,
    DialogImageComponent,
    DialogResumenComponent,
    EventLiveComponent,
    FilterPipe,
    FilterImeiPipe,
    HomeComponent,
    ContenedorComponent,
    EditarEtiquetaComponent,
    DialogEtiquetaComponent,
    DialogEditarEtiquetaComponent,
    DialogConfigComponent,
    MaterialFileUploadComponent,
    DialogListComandosComponent,
    DialogColeccionComponent,
    DialogGeocercaComponent,
    DialogGeocercaPoligonalComponent,
    DialogDetalleGeocercaComponent,
    DistanciaPipe,
    CantidadReversePipe,
    EsViajePipe,
    DiferenciaHoraPipe,
    ConvertAmPmPipe,
    ConvertMiAKmPipe,
    DialogResumenViajeComponent,
    ObtenerDireccionPipe,
    VisibilidadVehiculosComponent,
    DialogEditarGrupoComponent,
    ConvertUtcToLocalTimePipe,
    DialogEditarDispositivoComponent,
    MonitoreoComponent,
    DialogBuscarCoordenadaComponent,
    DialogVerGeocercasComponent,
    DialogConfirmComponent,
    FilterGeocercaPipe,
    FilterColeccionPipe,
    DialogConfirmAddressComponent,
    DialogEditarUsuarioComponent,
    InicioSesionComponent,
    DialogEditarNotificacionComponent,
    DialogAtenderNotificacionComponent,
    DuracionPipe,
    PrincipalComponent,
    DialogEditarConfiguracionScriptComponent,
    DialogVerVehiculosTriggersComponent,
    DialogVerGeocercasTriggersComponent,
    FilterDragPipe,
    ConductoresComponent,
    GeocercasRutaComponent,
    DialogGeocercaVisitadasComponent,
    TraductorPipe,
    DialogGeocercaFueraRutaComponent,
    DialogBuscarGeocercaComponent,
    NombreBloqueoMotorPipe,
    NombreBloqueoSalida2Pipe,
    SumatoriaVisitadaDentroRutaPipe,
    SumatoriaVisitadaFueraRutaRefPipe,
    SumatoriaVisitadaFueraRutaNorefPipe,
    ConvertUtcToLocalDatePipe,
    DialogConductoresActivosComponent,
    DialogRutasConductoresComponent,
    ConfiguracionesPerfilComponent,
    DialogImageDobleCamaraComponent,
    DialogAuditorDetallesComponent,
    DialogAgregarGeoRutaComponent,
    FilterGroupPipe,
    FilterDriverPipe,
    StartDatePipe,
    EndDatePipe,
    ContadorDiasPipe,
    ContadorDias2Pipe,
    ContadorDiasSumarioPipe,
    ContadorDiasSumario2Pipe,
    DialogDetalleSemanalDesvioRutaComponent,
    DialogDetalleVelocidadComponent,
    HistorialAsociacionesComponent,
    DialogDetalleVehiculoComponent,
    FilterEventosPipe,
    ConvertUtcToLocalTimeAmPmPipe,
    LabelParkingMovingPipe,
    ConvertMAKmPipe,
    EditarCorreosTriggerComponent,
    DialogEditarNotificacionPorAplicacionComponent,
    DialogEstadisticaVelocidadComponent,
    DialogGalleryComponent,
    DialogEditarTelefonosComponent,
    DialogVerVehiculosTriggersTelegramComponent,
    DialogVerGeocercasTriggersTelegramComponent,
    EditarColeccionComponent,
    EmuladorComponent],
  entryComponents: [
    DialogComponent,
    DialogCalendarComponent,
    DetallesViajesComponent,
    DialogImageComponent,
    DialogResumenComponent,
    EventLiveComponent,
    DialogEtiquetaComponent,
    DialogEditarEtiquetaComponent,
    DialogConfigComponent,
    DialogListComandosComponent,
    DialogColeccionComponent,
    DialogGeocercaComponent,
    DialogGeocercaPoligonalComponent,
    DialogDetalleGeocercaComponent,
    DialogResumenViajeComponent,
    VisibilidadVehiculosComponent,
    DialogEditarGrupoComponent,
    DialogEditarDispositivoComponent,
    DialogBuscarCoordenadaComponent,
    DialogVerGeocercasComponent,
    DialogConfirmComponent,
    DialogConfirmAddressComponent,
    DialogEditarUsuarioComponent,
    DialogEditarNotificacionComponent,
    DialogAtenderNotificacionComponent,
    DialogVerVehiculosTriggersComponent,
    DialogVerGeocercasTriggersComponent,
    GeocercasRutaComponent,
    DialogGeocercaVisitadasComponent,
    DialogGeocercaFueraRutaComponent,
    DialogBuscarGeocercaComponent,
    DialogConductoresActivosComponent,
    DialogRutasConductoresComponent,
    DialogImageDobleCamaraComponent,
    DialogAuditorDetallesComponent,
    DialogAgregarGeoRutaComponent,
    DialogDetalleSemanalDesvioRutaComponent,
    DialogDetalleVelocidadComponent,
    HistorialAsociacionesComponent,
    DialogDetalleVehiculoComponent,
    EditarCorreosTriggerComponent,
    DialogEditarNotificacionPorAplicacionComponent,
    DialogEstadisticaVelocidadComponent,
    DialogGalleryComponent,
    DialogVerVehiculosTriggersTelegramComponent,
    DialogVerGeocercasTriggersTelegramComponent,
    EditarColeccionComponent],
  imports: [
    NgxChartsModule,
    BrowserAnimationsModule,
    GalleryModule.withConfig({}),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatGridListModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatRadioModule,
    MatCardModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatBadgeModule,
    DragDropModule,
    MatRippleModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatVsTableModule,
    CdkTableModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    NbToastrModule.forRoot(),
    NbCalendarModule,
    NbCalendarRangeModule,
    NbListModule,
    NbChatModule,
    NbUserModule,
    NgxMatSelectSearchModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgxMaterialTimepickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: true,
        imageSize: 'cover'
      }
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
    
    constructor(private themeService: NbThemeService) {
        this.themeService.changeTheme('corporate');
    }
}
