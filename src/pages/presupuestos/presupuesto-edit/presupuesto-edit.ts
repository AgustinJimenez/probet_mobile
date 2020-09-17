import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-presupuesto-edit',
  templateUrl: 'presupuesto-edit.html',
})
export class PresupuestoEditPage {

	@ViewChild('input') myInput;
	presupuesto_id:number;
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
  		public events: Events,
  		public connection: Connection,
  		private renderer: Renderer,
  		private elementRef: ElementRef,
  		private keyboard: Keyboard,
  		public toastCtrl: ToastController,
  		private alertCtrl: AlertController,
  		public loadingCtrl: LoadingController
  	)
	{
		this.sqlite = new SQLite();
		this.presupuesto_id = this.navParams.get("presupuesto_id");
	}

	ionViewDidLoad()
	{
	}

	ionViewWillEnter()
	{
		this.get_presupuesto();
	}

	get_presupuesto()
	{
		this.sqlite.create(this.connection.database_config)
		.then((db: SQLiteObject) =>
		{
			this.sql = "SELECT * FROM presupuestos WHERE id = "+ this.presupuesto_id +" LIMIT 1";
			db.executeSql(this.sql, {})
			.then((rs) =>
			{
				if (rs.rows.length)
					this.presupuesto = rs.rows.item(0);
			}).catch(e => console.log(e));
		})
		.catch(e => console.log(e));
	}

	on_submit()
	{
		if (!this.form_has_errors())
		{
			console.log(this.presupuesto);
			let loading = this.loadingCtrl.create({
			    content: 'Guardando...'
			});
			loading.present();

			// let aux_margen = this.presupuesto.margen.replace(/,/g, '.');
			console.log("margen " + this.presupuesto.margen);

		    this.sql = "UPDATE presupuestos SET " +
		    "fecha = '"+ this.presupuesto.fecha +"', "+
		    "nombre = '"+ this.presupuesto.nombre +"', "+
		    "cliente = '"+ this.presupuesto.cliente +"', "+
		    "observacion = '"+ this.presupuesto.observacion +"', "+
		    "margen = "+ this.presupuesto.margen/*aux_margen*/ +
		    " WHERE id = "+ this.presupuesto_id;
		    this.sqlite.create(this.connection.database_config)
		    .then((db: SQLiteObject) =>
		    {
		      db.executeSql(this.sql, {})
		      .then((rs) =>
		      {
		      	loading.dismiss();
		        let toast = this.toastCtrl.create({
					message: 'Presupuesto actualizado exitosamente',
					duration: 1000
				});

				toast.onDidDismiss(() =>
				{
					this.navCtrl.pop();
				});

				toast.present();
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

	go_back()
	{
		this.navCtrl.pop();
	}

  delete_presupuesto(presupuesto)
  {
    let alert = this.alertCtrl.create
    ({
      title: 'Atención!',
      subTitle: 'Está seguro que desea eliminar el Presupuesto?',
      buttons:
      [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: data =>
        {
          //console.log('Cancel clicked');
        }
      },
      {
        text: 'Aceptar',
        handler: data =>
        {
          this.sqlite.create(this.connection.database_config)
          .then((db: SQLiteObject) =>
          {
          console.log("Presupuesto id " + presupuesto.id );
            this.sql = "DELETE FROM presupuestos WHERE id = " + presupuesto.id;
            db.executeSql(this.sql, {})
            .then((rs) =>
            {
            console.log("Hola ");
            let toast = this.toastCtrl.create({
                message: 'Presupuesto eliminado exitosamente',
                duration: 2000
              });

              toast.onDidDismiss(() =>
      				{
      					this.navCtrl.pop();
      				});

              toast.present();

          }).catch(e => console.log(e));

          }).catch(e => console.log(e));

        }
      }
      ]
    });
    alert.present();
  }

}
