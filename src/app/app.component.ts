import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MaterialesPage } from '../pages/materiales/materiales';
import { RubrosPage } from '../pages/rubros/rubros';
import { PresupuestoIndexPage } from "../pages/presupuestos/presupuesto-index/presupuesto-index";
import { ProveedoresIndexPage } from "../pages/proveedores/proveedores-index/proveedores-index";
import { InicioPage } from "../pages/inicio/inicio";


import { Connection } from "../providers/config/database";

@Component({
  templateUrl: 'app.html',
})
export class MyApp
{
  @ViewChild(Nav) nav: Nav;

  /*rootPage: any = MaterialesPage;*/
  rootPage: any;
  pagina_activa: any;
  pages: Array<{title: string, component: any, index: number, image: string, sub_menu_of_page: number, has_sub_menu: boolean}>;

  constructor
  (
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public db_connection: Connection,
    private toastCtrl: ToastController,
    public events: Events,
    )
  {
    this.initializeApp();
    console.log("antes","init db");

    console.log("despues","init db");
    events.subscribe('openPage',(page) => this.openPage(page));
    events.subscribe('getPages',() => this.getPages());
    // used for an example of ngFor and navigation
    this.pages =
    [
      { title: "Inicio", component: InicioPage, index: 6, image: 'home.png', sub_menu_of_page: -1, has_sub_menu: false },
      { title: 'Proveedores y Contratistas', component: MaterialesPage, index: 1, image: 'search.png', sub_menu_of_page: -1, has_sub_menu: true },
      { title: 'Por materiales y servicios', component: MaterialesPage, index: 2, image: 'arrow-next.png', sub_menu_of_page: 1, has_sub_menu: false },
      { title: 'Por nombre', component: ProveedoresIndexPage, index: 3, image: 'arrow-next.png', sub_menu_of_page: 1, has_sub_menu: false },
      { title: "Presupuestos", component: PresupuestoIndexPage, index: 4, image: 'presupuestos.png', sub_menu_of_page: -1, has_sub_menu: false },
      { title: "Rubros desglozados", component: RubrosPage, index: 5, image: 'rubros.png', sub_menu_of_page: -1, has_sub_menu: false },
    ];
  }

  initializeApp()
  {
    this.platform.ready().then(() =>
    {
      this.rootPage = InicioPage;
      this.db_connection.init_db();
      this.statusBar.styleDefault();

      this.pagina_activa = this.pages[0];


      var lastTimeBackPress = 0;
       var timePeriodToExit  = 2000;

       this.platform.registerBackButtonAction(() => {
           // get current active page
           if(this.nav.canGoBack()){
             this.nav.pop();
           }else{
               //Double check to exit app
               if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                   this.platform.exitApp(); //Exit from app
               } else {
                   let toast = this.toastCtrl.create({
                       message:  'Presione atrás nuevamente para abandonar la aplicación.',
                       duration: 3000,
                       position: 'bottom'
                   });
                   toast.present();
                   lastTimeBackPress = new Date().getTime();
               }
           }
       });

       //this.splashScreen.hide();


    });
  }

  openPage(page)
  {
    this.pagina_activa = page;
    this.nav.push(page.component);
    console.log("openPage",this.nav);
  }

  check_cual_pagina_activa(page)
  {
    // if(this.nav.getActive() && page.component){
    //   if(this.nav.getActive().component == page.component){
    //     console.log("if","es igual");
    //   }
    // }

    if(this.pagina_activa){
      if(this.pagina_activa.sub_menu_of_page == page.index){
        return true;
      }
    }
    return page == this.pagina_activa;
  }

  getPages(){
    console.log("components","getpages");
    return this.pages;
  }
}
