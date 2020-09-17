import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
//import { Presupuesto } from "./../../../providers/entities/presupuesto";
import { PresupuestoProvider } from "./../../../providers/presupuesto";
import { PresupuestoSeleccionCategoriaRubrosPage } from "./../presupuesto-seleccion-categoria-rubros/presupuesto-seleccion-categoria-rubros";
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-presupuesto-create',
  templateUrl: 'presupuesto-create.html',
})
export class PresupuestoCreatePage
{
	@ViewChild('input') myInput;
	presupuesto:any =
	{
		fecha:"",
		nombre:"",
		cliente:"",
		observacion:"",
		margen:0
	};
	sqlite:SQLite;
  	sql:string;
  	constructor
  	(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public presupuesto_provider:PresupuestoProvider,
  		public events: Events,
  		public connection: Connection,
  		private renderer: Renderer,
  		private elementRef: ElementRef,
  		private keyboard: Keyboard,
  		private alertCtrl: AlertController,
  		public loadingCtrl: LoadingController
  	)
	{
		this.presupuesto.fecha =  new Date().toISOString();
	}

	ionViewDidLoad()
	{
		this.setFocus();
	}

	setFocus()
	{
		setTimeout(() => {
	      this.myInput.setFocus();
	    }, 1000);
	    this.keyboard.show();
	}

	on_submit()
	{
		if (!this.form_has_errors())
		{
			let loading = this.loadingCtrl.create({
			    content: 'Guardando...'
			});
			loading.present();

			// let aux_margen = this.presupuesto.margen.replace(/,/g, '.');
			// console.log(aux_margen);
			console.log("margen " + this.presupuesto.margen);

			this.sqlite = new SQLite();
		    this.sql = "INSERT INTO presupuestos (fecha, nombre, cliente, observacion, margen) VALUES ('"+this.presupuesto.fecha+"', '"+this.presupuesto.nombre+"', '"+this.presupuesto.cliente+"', '"+this.presupuesto.observacion+"', "+this.presupuesto.margen/*aux_margen*/+") ";
		    console.log( "executing query: "+this.sql );
		    this.sqlite.create(this.connection.database_config)
		    .then((db: SQLiteObject) =>
		    {
		      db.executeSql(this.sql, {})
		      .then((rs) =>
		      {
		      	loading.dismiss();
		      	this.keyboard.close();
		        //this.go_to_presupuesto_seleccion_rubro(rs.insertId);
            this.go_to_presupuesto_index();
		      })
		      .catch(e => console.log(e));
		    })
		    .catch(e => console.log(e));
		}
	}

	form_has_errors()
	{
		let errors:boolean = false;

		if (!this.validate('text'))
		{
			errors = true;
			this.showAlert('text');
		}
		else if (!this.validate('number'))
		{
			errors = true;
			this.showAlert('number');
		}

		return errors;
	}

	validate(type)
	{
		if (type == 'number')
			return this.is_valid_double(this.presupuesto.margen);
		else
			return this.is_valid_length(this.presupuesto.nombre) && this.is_valid_length(this.presupuesto.cliente);
	}

	is_valid_double(val)
	{
		// console.log(!isNaN(parseFloat(val)) && isFinite(val));
		return !isNaN(parseFloat(val)) && isFinite(val);
	}

	is_valid_length(val)
	{
		return val.length > 0 && val.length < 500;
	}

	showAlert(type) {
		let msg:string = '';
		if (type == 'number')
			msg = 'El valor del beneficio ingresado es incorrecto';
		else
			msg = 'El rango de caracteres aceptado es (mínimo 1, máximo 500)';
		let alert = this.alertCtrl.create({
			title: 'Atención!',
			subTitle: msg,
			buttons: ['Aceptar']
		});
		alert.present();
	}

	go_to_presupuesto_seleccion_rubro(presupuesto_id)
	{
		this.navCtrl.push( PresupuestoSeleccionCategoriaRubrosPage, { presupuesto_id:presupuesto_id, show_back:false } ).then(() => {
		  const index = this.navCtrl.getActive().index;
		  this.navCtrl.remove(0, index);
		});
	}

  go_to_presupuesto_index()
  {
    this.navCtrl.pop();
  }

	go_back()
	{
		this.navCtrl.pop();
	}
}
