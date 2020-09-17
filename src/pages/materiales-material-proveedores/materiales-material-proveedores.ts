import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MaterialesProvider } from '../../providers/materiales';
import { RoutesProvider } from "./../../providers/config/routes";
import { ToastProvider } from "./../../providers/config/toast-provider";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-materiales-material-proveedores',
  templateUrl: 'materiales-material-proveedores.html',
})
export class MaterialesMaterialProveedoresPage 
{
	material:any;
	proveedores:Array<Object>;

  constructor
  (
  	public navCtrl: NavController, 
  	public parametros_pasados: NavParams,
  	public materiales_service: MaterialesProvider, 
  	public loadingCtrl: LoadingController,
    public routes: RoutesProvider,
    public toast: ToastProvider,
    public http: Http
  )
  {
  	this.material = this.parametros_pasados.get("material");
  	this.get_proveedores_de_material( this.material.id );
  }
  ionViewDidLoad()
  {
      
  }

  get_proveedores_de_material(id)
  {
    let loading = this.loadingCtrl.create();
    let url = this.routes.material_proveedores_url +id+ "?" + this.routes.api_token;
    console.log(url);
    loading.present();
    this.http.get( url ).map( res => res.json() ).subscribe(elements => 
    { 
      this.proveedores = elements;

      if( !this.proveedores.length )
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

  open_web_site(url)
  {
    this.materiales_service.open_browser(url);
  }

  open_email(email)
  {
    this.materiales_service.open_mail(email);
  }

  open_location(latitude, longitude)
  {
    this.materiales_service.open_map(latitude, longitude);
  }

}
