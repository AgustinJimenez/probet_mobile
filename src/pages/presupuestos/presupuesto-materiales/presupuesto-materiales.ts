import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-presupuesto-materiales',
  templateUrl: 'presupuesto-materiales.html',
})
export class PresupuestoMaterialesPage {

	presupuesto_id:number;
	sqlite:SQLite;
  	sql:string;
  	public materiales:Array<any> = [];
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
		this.get_presupuesto_materiales();
	}

	get_presupuesto_materiales()
	{
		this.sqlite.create(this.connection.database_config)
		.then((db: SQLiteObject) =>
		{
			this.sql = "SELECT * FROM presupuesto_materiales WHERE presupuesto_id = "+ this.presupuesto_id +" ORDER BY material_nombre";
			db.executeSql(this.sql, {})
			.then((rs) =>
			{
				this.materiales = [];
				if (rs.rows.length)
				{
					for (var i = 0; i < rs.rows.length; i++)
					{
						let material:any = rs.rows.item(i);

						this.sql = "SELECT * FROM presupuesto_rubro_material WHERE presupuesto_id = "+ this.presupuesto_id +" AND material_id = "+ material.material_id;
						db.executeSql(this.sql, {})
						.then((rs) =>
						{
							let cantidad:number = 0.0;
							if (rs.rows.length)
							{
								for (var i = 0; i < rs.rows.length; i++)
								{
									let mat_rubro:any = rs.rows.item(i);

									this.sql = "SELECT * FROM presupuesto_rubro WHERE presupuesto_id = "+ this.presupuesto_id +" AND rubro_id = "+ mat_rubro.rubro_id;
									db.executeSql(this.sql, {})
									.then((rs) =>
									{
										if (rs.rows.length)
										{
											for (var i = 0; i < rs.rows.length; i++)
											{
												let rubro:any = rs.rows.item(i);
												cantidad += mat_rubro.cantidad * rubro.cantidad;

											}

											material.cantidad_total = cantidad;
											if (this.materiales.indexOf(material) == -1)
												this.materiales.push( material );
										}
									});
								}
							}
						});
					}
				}
			}).catch(e => console.log(e));
		})
		.catch(e => console.log(e));
	}

	material_precio_prompt( material )
	{
		let alert = this.alertCtrl.create
		({
			title: 'Precio Unitario',
			subTitle: material.material_nombre + ' ('+material.unidad_de_medida+')',
			inputs: [
			{
				name: 'precio',
				type: 'number',
				value: material.precio_unitario
			}
			],
			buttons:
			[
			{
				text: 'Cancelar',
				role: 'cancel',
				handler: data =>
				{
				}
			},
			{
				text: 'Guardar',
				handler: data =>
				{
					if(data.precio != "" && data.precio != material.precio_unitario && this.validate_number(data.precio))
					{
						this.sqlite.create(this.connection.database_config)
						.then((db: SQLiteObject) =>
						{
							this.sql = "UPDATE presupuesto_materiales SET precio_unitario = "+ data.precio +" WHERE material_id = " + material.material_id;
							db.executeSql(this.sql, {})
							.then((rs) =>
							{
								material.precio_unitario = data.precio;

								let toast = this.toastCtrl.create({
									message: 'Material actualizado exitosamente',
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

	get_precio_total(material)
	{
		return (material.cantidad_total * material.precio_unitario);
	}

	get_total(materiales)
	{
		let acu:number = 0;
		for (let material of materiales)
			acu += material.cantidad_total * material.precio_unitario;

		return acu;
	}
}
