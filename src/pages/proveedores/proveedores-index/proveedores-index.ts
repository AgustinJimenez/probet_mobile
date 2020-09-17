import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProveedoresProvider } from '../../../providers/proveedores';
import{ ProveedoresDetallesPage } from "./../proveedores-detalles/proveedores-detalles";
import { RoutesProvider } from "./../../../providers/config/routes";
import { LoadingController } from 'ionic-angular';
import { ToastProvider } from "./../../../providers/config/toast-provider";
import { Http } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-proveedores-index',
  templateUrl: 'proveedores-index.html',
  providers: [ProveedoresProvider]
})
export class ProveedoresIndexPage 
{
  @ViewChild('input') myInput;
	public proveedores:any;
	public loading: any;
  public search_terms:String;

  constructor
  (
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public proveedores_service: ProveedoresProvider,
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
    //this.cargar_proveedores("");
  }

  search_proveedores()
  {
    this.cargar_proveedores(this.search_terms);
    this.keyboard.close();
  }

  cargar_proveedores( terms )
  {
    let loading = this.loadingCtrl.create();
    let url = this.routes.proveedores_index_url + "?params=" +terms+ "&" + this.routes.api_token;
    loading.present();
    this.http.get( url ).map( res => res.json() ).subscribe(elements => 
    { 
      this.proveedores  = elements;

      if( !this.proveedores.length )
        this.toast.show_message('no_results');
      
      loading.dismiss();
    }, err =>
    {
      loading.dismiss();
      this.toast.show_message('no_server_available');
      console.log(err);
    });
    
  }

  go_to_proveedor_detalles(proveedor)
  {
      this.keyboard.close();
      this.navCtrl.push( ProveedoresDetallesPage, {id:proveedor.id} );
  }

}
