import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MaterialesProvider } from '../../providers/materiales';
import { MaterialesMaterialProveedoresPage } from "../materiales-material-proveedores/materiales-material-proveedores";
import { RoutesProvider } from "./../../providers/config/routes";
import { ToastProvider } from "./../../providers/config/toast-provider";
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-materiales',
  templateUrl: 'materiales.html',
  providers: [MaterialesProvider]
})
export class MaterialesPage 
{
  @ViewChild('input') myInput;
	public materiales = [];
  public loading: any;
  public search_terms:String;

  constructor
  (
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public materiales_service: MaterialesProvider,
    public routes: RoutesProvider,
    public http: Http,
    public toast: ToastProvider,
    public loadingCtrl: LoadingController,
    public keyboard: Keyboard,
  ) 
  {
      this.keyboard.close();
  }

  setFocus()
  {
    setTimeout(() => {
        this.myInput.setFocus();
      }, 1000);
      this.keyboard.show();
  }

 
  ionViewDidLoad()
  {
    this.setFocus();
    //this.cargar_materiales("");
  }

  search_materiales()
  {
    this.cargar_materiales(this.search_terms);
    this.keyboard.close();
  }

  cargar_materiales( terms )
  {
    let loading = this.loadingCtrl.create();
    let url = this.routes.materiales_index_url + "?params=" +terms+ "&" + this.routes.api_token;
    loading.present();
    this.http.get( url ).map( res => res.json() ).subscribe(elements => 
    { 
      this.materiales = elements;

      if( !this.materiales.length )
        this.toast.show_message('no_results');

      loading.dismiss();
    },
     err =>
    {
      
      loading.dismiss();
      this.toast.show_message('no_server_available');
      console.log(err);
    });

  }

  go_to_material_detalles(material)
  {
      this.keyboard.close();
      this.navCtrl.push( MaterialesMaterialProveedoresPage, {material:material} );
  }

}
