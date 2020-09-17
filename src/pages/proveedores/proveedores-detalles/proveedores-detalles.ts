import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProveedoresProvider } from '../../../providers/proveedores';
import { RoutesProvider } from "./../../../providers/config/routes";
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@IonicPage()
@Component({
  selector: 'page-proveedores-detalles',
  templateUrl: 'proveedores-detalles.html',
  providers: [ProveedoresProvider]
})
export class ProveedoresDetallesPage 
{
	public id:any;
	public proveedor:Object = 
	{
		nombre:"",
		imagen_url:"",
		latitud:"",
		longitud:"",
		direccion:"",
		nro_telefono:"",
		email:"",
		direccion_web:"",
	};
	titulo:string;
	constructor
	(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public proveedores_service: ProveedoresProvider,
		public loadingCtrl: LoadingController,
		public routes: RoutesProvider,
		public http: Http
	) 
	{

	}

  
  ionViewWillEnter()
  {
  	this.id = this.navParams.get("id");
  	this.get_proveedor( this.id );
  	

  }
  	get_proveedor(id)
  	{
  		let loading = this.loadingCtrl.create();
		let url = this.routes.proveedor_url +id+ "?" + this.routes.api_token;
		//console.log(url);
		loading.present();
		this.http.get( url ).map( res => res.json() ).subscribe(elements => 
		{ 
		  this.proveedor = elements;
		  //console.log( this.proveedor );
		  loading.dismiss();
		}, err =>
	    {
	      loading.dismiss();
	      console.log(err);
	    });
  	}

  	open_web_site(url)
	{
		this.proveedores_service.open_browser(url);
	}

	open_email(email)
	{
		this.proveedores_service.open_mail(email);
	}

	open_location(latitude, longitude)
	{
		this.proveedores_service.open_map(latitude, longitude);
	}
}
