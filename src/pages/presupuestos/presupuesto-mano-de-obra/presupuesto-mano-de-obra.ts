import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-presupuesto-mano-de-obra',
  templateUrl: 'presupuesto-mano-de-obra.html',
})
export class PresupuestoManoDeObraPage {

	presupuesto_id:number;
	sqlite:SQLite;
  	sql:string;
  	public rubros:Array<any> = [];
  	public categorias:Array<any> = [];
  	public tmp_ids:Array<number> = [];
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public connection: Connection,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController
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
		this.get_presupuesto_rubros();
	}

	get_presupuesto_rubros()
	{

		this.sqlite.create(this.connection.database_config)
		.then((db: SQLiteObject) => 
		{

			this.sql = "SELECT * FROM presupuesto_rubro WHERE presupuesto_id = " + this.presupuesto_id + " ORDER BY categoria_id ASC";
			db.executeSql(this.sql, {})
			.then((rs) => 
			{
				this.rubros = [];
				if (rs.rows.length)
				{
					for (var i = 0; i < rs.rows.length; i++)
					{
						this.rubros.push( rs.rows.item(i) );
						if (this.tmp_ids.indexOf(rs.rows.item(i).categoria_id) == -1)
							this.tmp_ids.push( rs.rows.item(i).categoria_id );
					}
				}

				let aux = JSON.stringify(this.tmp_ids);
				aux = aux.replace('[', '(').replace(']', ')');

				this.sql = "SELECT * FROM categoria_rubro WHERE id_servidor IN " + aux +" ORDER BY numero";
				db.executeSql(this.sql, {})
				.then((rs) => 
				{
					this.categorias = [];
					if (rs.rows.length)
						for (var i = 0; i < rs.rows.length; i++)
							this.categorias.push( rs.rows.item(i) );

				}).catch(e => console.log(e));

			}).catch(e => console.log(e));

		})
		.catch(e => console.log(e));

	}

	rubro_mano_de_obra_prompt( rubro )
	{
		// console.log(rubro);
		let alert = this.alertCtrl.create
		({
			title: 'Mano de Obra',
			subTitle: rubro.rubro_nombre + ' ('+rubro.rubro_unidad_de_medida+')',
			inputs: [
			{
				name: 'precio',
				type: 'number',
				value: rubro.rubro_precio_mano_de_obra
			}
			],
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
				text: 'Guardar',
				handler: data => 
				{
					// console.log(data.precio);
					if(data.precio != "" && data.precio != rubro.rubro_precio_mano_de_obra && this.validate_number(data.precio))
					{
						this.sqlite.create(this.connection.database_config)
						.then((db: SQLiteObject) => 
						{
							this.sql = "UPDATE presupuesto_rubro SET rubro_precio_mano_de_obra = "+ data.precio +" WHERE presupuesto_id = "+ this.presupuesto_id +" AND rubro_id = "+ rubro.rubro_id;
							db.executeSql(this.sql, {})
							.then((rs) => 
							{
								rubro.rubro_precio_mano_de_obra = data.precio;

								let toast = this.toastCtrl.create({
									message: 'Rubro actualizado exitosamente',
									duration: 2000
								});
								toast.present();

							}).catch(e => console.log(e));
						})
						.catch(e => console.log(e));
					}
				}
			}
			]
		});
		alert.present();
	}

	validate_number(val)
	{
		var regexp = new RegExp('^\\d+$');
		return regexp.test(val);
	}

	get_total_rubro(rubro)
	{
		return (rubro.rubro_precio_mano_de_obra * rubro.cantidad);
	}

	get_total(rubros)
	{
		let acu:number = 0;
		for (let rubro of rubros)
			acu += rubro.rubro_precio_mano_de_obra * rubro.cantidad;

		return acu;
	}
}