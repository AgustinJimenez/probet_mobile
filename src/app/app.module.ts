import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/*PAGES*/
import { InicioPage } from '../pages/inicio/inicio';
import { MaterialesPage } from '../pages/materiales/materiales';
import { MaterialesMaterialProveedoresPage } from "../pages/materiales-material-proveedores/materiales-material-proveedores";
import { PresupuestoIndexPage } from "../pages/presupuestos/presupuesto-index/presupuesto-index";
import { PresupuestoCreatePage } from "../pages/presupuestos/presupuesto-create/presupuesto-create";
import { PresupuestoCostoPage } from "../pages/presupuestos/presupuesto-costo/presupuesto-costo";
import { PresupuestoMaterialesPage } from "../pages/presupuestos/presupuesto-materiales/presupuesto-materiales";
import { ProveedoresIndexPage } from "../pages/proveedores/proveedores-index/proveedores-index";
import { ProveedoresDetallesPage } from "../pages/proveedores/proveedores-detalles/proveedores-detalles";
import { PresupuestoSeleccionCategoriaRubrosPage } from "../pages/presupuestos/presupuesto-seleccion-categoria-rubros/presupuesto-seleccion-categoria-rubros";
import { PresupuestoManoDeObraPage } from "../pages/presupuestos/presupuesto-mano-de-obra/presupuesto-mano-de-obra";
import { PresupuestoEditPage } from "../pages/presupuestos/presupuesto-edit/presupuesto-edit";
import { PresupuestoOfertaPage } from "../pages/presupuestos/presupuesto-oferta/presupuesto-oferta";
import { RubrosPage } from '../pages/rubros/rubros';
import { RubrosComposicionPage } from '../pages/rubros-composicion/rubros-composicion';

/*OTHERS*/
import { HttpModule} from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SQLite } from '@ionic-native/sqlite';
import { DatePipe } from "@angular/common";
//import { createConnection } from "ionic-orm-2";

/*PROVIDERS*/
import { MasterComponent } from '../components/master/master';
import { ProveedoresProvider } from '../providers/proveedores';
import { RoutesProvider } from '../providers/config/routes';
import { Connection } from '../providers/config/database';
import { ToastProvider } from '../providers/config/toast-provider';
import { PresupuestoProvider } from '../providers/presupuesto';
import { MaterialesProvider } from '../providers/materiales';
import { Keyboard } from '@ionic-native/keyboard';



/*components*/
import { MaterialProveedoresComponent } from '../components/material-proveedores/material-proveedores';

@NgModule({
  declarations: [
    InicioPage,
    MyApp,
    MaterialesPage,
    MaterialesMaterialProveedoresPage,
      MasterComponent,
    MaterialProveedoresComponent,
    PresupuestoIndexPage,
    PresupuestoCreatePage,
    PresupuestoCostoPage,
    PresupuestoMaterialesPage,
    ProveedoresIndexPage,
    ProveedoresDetallesPage,
    PresupuestoSeleccionCategoriaRubrosPage,
    PresupuestoManoDeObraPage,
    PresupuestoOfertaPage,
    PresupuestoEditPage,
    RubrosPage,
    RubrosComposicionPage
  ],
  imports:
  [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents:
  [
    InicioPage,
    MyApp,
    MaterialesPage,
    MaterialesMaterialProveedoresPage,
    PresupuestoIndexPage,
    PresupuestoCreatePage,
    PresupuestoCostoPage,
    PresupuestoSeleccionCategoriaRubrosPage,
    ProveedoresIndexPage,
    ProveedoresDetallesPage,
    PresupuestoMaterialesPage,
    PresupuestoManoDeObraPage,
    PresupuestoEditPage,
    PresupuestoOfertaPage,
    RubrosPage,
    RubrosComposicionPage,
    MasterComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MaterialesProvider,
    InAppBrowser,
    ProveedoresProvider,
    RoutesProvider,
    Connection,
    PresupuestoProvider,
    SQLite,
    DatePipe,
    Keyboard,
    ToastProvider
  ]
})
export class AppModule {}
