import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { RoutesProvider } from "./../../providers/config/routes";
import { ToastProvider } from "./../../providers/config/toast-provider";
import { LoadingController } from 'ionic-angular';
import { RubrosComposicionPage } from "../rubros-composicion/rubros-composicion";

@IonicPage()
@Component({
  selector: 'page-rubros',
  templateUrl: 'rubros.html',
})
export class RubrosPage {

	categorias_rubros:any;
	mostrar_lista = null;
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public routes: RoutesProvider,
		public http: Http,
		public toast: ToastProvider
	)
	{
		this.get_categorias_rubros();
	}

	ionViewDidLoad()
	{
	}

	get_categorias_rubros()
	{
		let loading = this.loadingCtrl.create();
	    let url = this.routes.seleccion_categorias_with_rubros_url + "?" + this.routes.api_token;
	    loading.present();
	    this.http.get( url ).map( res => res.json() ).subscribe(elements => 
	    { 
			this.categorias_rubros = elements;

	      	loading.dismiss();
	    }, err =>
	    {
	      loading.dismiss();
	      this.toast.show_message('no_server_available');
	      console.log(err);
	    });
	}

	is_showing_lista(indice) 
	{
	  	return this.mostrar_lista === indice;
	}


	toggle_lista(indice) 
	{
		if ( this.is_showing_lista(indice) ) 
			this.mostrar_lista = null;
		else 
			this.mostrar_lista = indice;
	}

	rubro_composicion(rubro)
	{
		this.navCtrl.push( RubrosComposicionPage, { rubro:rubro } );
	}
}
