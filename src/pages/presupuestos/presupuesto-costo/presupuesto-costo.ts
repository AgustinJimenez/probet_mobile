import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ViewController } from 'ionic-angular';
import { PresupuestoProvider } from "./../../../providers/presupuesto";
import { RoutesProvider } from "./../../../providers/config/routes";
import { LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { PresupuestoSeleccionCategoriaRubrosPage } from "./../presupuesto-seleccion-categoria-rubros/presupuesto-seleccion-categoria-rubros";
import { PresupuestoMaterialesPage } from "./../presupuesto-materiales/presupuesto-materiales";
import { PresupuestoManoDeObraPage } from "./../presupuesto-mano-de-obra/presupuesto-mano-de-obra";
//import { PresupuestoIndexPage } from "./../presupuesto-index/presupuesto-index";

@IonicPage()
@Component({
  selector: 'page-presupuesto-costo',
  templateUrl: 'presupuesto-costo.html',
})
export class PresupuestoCostoPage
{
	presupuesto_id:number;
	showBack:boolean;
	presupuesto:any =
	{
		fecha:"",
		nombre:"",
		cliente:"",
		observacion:""
	};
	mostrar_lista = null;
	public rubros:Array<any> = [];
	public rubros_materiales:Array<any> = [];
	public categorias:Array<any> = [];
	public tmp_ids:Array<number> = [];
	sqlite:SQLite;
  	sql:string;
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public presupuesto_service: PresupuestoProvider,
		public alertCtrl: AlertController,
		public routes: RoutesProvider,
		public http: Http,
		public loadingCtrl: LoadingController,
		public connection: Connection,
		public toastCtrl: ToastController,
		public viewCtrl: ViewController
	)
	{
		this.sqlite = new SQLite();
		this.presupuesto_id = this.navParams.get("presupuesto_id");
		this.showBack = this.navParams.get("show_back");
	}

	ionViewDidLoad()
	{
		if (!this.showBack)
			this.viewCtrl.showBackButton(false);
	}

	ionViewWillEnter()
	{
		this.get_data_presupuesto();
	}

	get_data_presupuesto()
	{
		this.sqlite.create(this.connection.database_config)
		.then((db: SQLiteObject) =>
		{
			this.sql = "SELECT id, fecha, nombre, cliente, observacion FROM presupuestos WHERE id = " + this.presupuesto_id;
			db.executeSql(this.sql, {})
			.then((rs) =>
			{
				this.presupuesto = rs.rows.item(0);

				this.sql = "SELECT * FROM presupuesto_rubro WHERE presupuesto_id = " + this.presupuesto_id + " ORDER BY categoria_id ASC";
				db.executeSql(this.sql, {})
				.then((rs) =>
				{
					this.rubros = [];
					this.tmp_ids = [];
					if(rs.rows.length)
					{

						for(var i = 0; i < rs.rows.length; i++)
						{
							// console.log(rs.rows.item(i));
							this.rubros.push( rs.rows.item(i) );
							if (this.tmp_ids.indexOf(rs.rows.item(i).categoria_id) == -1)
								this.tmp_ids.push( rs.rows.item(i).categoria_id );
						}

						let last_categoria:number = 0;
						let index:number = 1;
						for (let rubro of this.rubros)
						{
							if(last_categoria != rubro.categoria_id)
							{
								index = 1;
								last_categoria = rubro.categoria_id;
								rubro.index = index;
							}
							else
							{
								index = index+1;
								rubro.index = index;
							}

							rubro.precio_unitario_costo = rubro.rubro_precio_mano_de_obra;
							// let rubro_precio_total:number = 0;
							this.sql = "SELECT * FROM presupuesto_rubro_material WHERE presupuesto_id = " + this.presupuesto_id + " AND presupuesto_rubro_id = " + rubro.id;
							db.executeSql(this.sql, {})
  							.then((rs) =>
							{
								this.rubros_materiales = [];
								let rubro_material:any;
								if(rs.rows.length)
								{
									for(var i = 0; i < rs.rows.length; i++)
									{
										this.rubros_materiales.push( rs.rows.item(i) );
										rubro_material = rs.rows.item(i);
										console.log("rubro material id: " + rubro_material.material_id);
                    console.log("rubro material cantidad: " + rubro_material.cantidad);

                    let cantidad_aux:any;
                    cantidad_aux = rubro_material.cantidad;

										this.sql = "SELECT * FROM presupuesto_materiales WHERE presupuesto_id = " + this.presupuesto_id + " AND material_id = " + rubro_material.material_id + " LIMIT 1";
										db.executeSql(this.sql, {})
										.then((rs) =>
										{
											let material:any;
											let aux_total:number = 0;
											let rubro_precio_unitario:number = 0;
											// console.log("calculos rubro: " + rubro.rubro_nombre);
											if (rs.rows.length)
											{
												material = rs.rows.item(0);
												console.log("precio unitario " + material.precio_unitario + " rubro cantidad aux " + cantidad_aux);
												aux_total = (material.precio_unitario * cantidad_aux);
												console.log("rubro precio unitario " + rubro.precio_unitario_costo);
												rubro_precio_unitario = (aux_total + rubro.precio_unitario_costo);
												console.log("rubro precio total " + rubro_precio_unitario);
												rubro.precio_unitario_costo = rubro_precio_unitario;
												console.log("after calculos " + rubro.precio_unitario_costo);
											}

										}).catch(e => console.log(e));
									}
								}

							}).catch(e => console.log(e));
						}

					}

					let aux = JSON.stringify(this.tmp_ids);
					aux = aux.replace('[', '(').replace(']', ')');

					this.sql = "SELECT * FROM categoria_rubro WHERE id_servidor IN " + aux + " ORDER BY numero";
					db.executeSql(this.sql, {})
					.then((rs) =>
					{
						this.categorias = [];
						if(rs.rows.length)
							for(var i = 0; i < rs.rows.length; i++)
								this.categorias.push( rs.rows.item(i) );

					}).catch(e => console.log(e));

				}).catch(e => console.log(e));

			}).catch(e => console.log(e));
		})
		.catch(e => console.log(e));
	}

	rubro_cantidad_prompt( rubro )
	{
		// console.log(rubro);
		let alert = this.alertCtrl.create
		({
			title: 'Cantidad',
			subTitle: rubro.rubro_nombre + ' ('+rubro.rubro_unidad_de_medida+')',
			inputs: [
			{
				name: 'cantidad',
				// placeholder: rubro.cantidad,
				value: rubro.cantidad,
				type: 'number'
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
					// console.log(data.cantidad);
					if(data.cantidad != "" && data.cantidad != rubro.cantidad && this.is_valid_double(rubro.cantidad))
					{
						this.sqlite.create(this.connection.database_config)
						.then((db: SQLiteObject) =>
						{
							this.sql = "UPDATE presupuesto_rubro SET cantidad = "+ data.cantidad +" WHERE presupuesto_id = "+ this.presupuesto_id +" AND rubro_id = "+ rubro.rubro_id;
							db.executeSql(this.sql, {})
							.then((rs) =>
							{
								rubro.cantidad = data.cantidad;

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

	delete_rubro(rubro)
	{
		// console.log(rubro);
		let alert = this.alertCtrl.create
		({
			title: 'Atención!',
			subTitle: 'Está seguro que desea eliminar el Rubro?',
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
					// console.log(this.rubros_materiales);
					let index = this.rubros.indexOf(rubro);
					// console.log(this.rubros);
					if (index > -1)
						this.rubros.splice(index, 1);
					// console.log(this.rubros);

					this.sqlite.create(this.connection.database_config)
					.then((db: SQLiteObject) =>
					{

						this.sql = "SELECT * FROM presupuesto_rubro_material WHERE presupuesto_id = " + this.presupuesto_id + " AND rubro_id = " + rubro.rubro_id;
						db.executeSql(this.sql, {})
						.then((rs) =>
						{
							// console.log(rs);
							let aux_mat:any;
							if (rs.rows.length)
							{

								for(var i = 0; i < rs.rows.length; i++)
								{

									aux_mat = rs.rows.item(i);
									// console.log(aux_mat);

									this.sql = "SELECT * FROM presupuesto_materiales WHERE presupuesto_id != " + this.presupuesto_id + " AND material_id = " + aux_mat.material_id;
									db.executeSql(this.sql, {})
									.then((rs) =>
									{

										console.log(rs.rows.length);
										if (!rs.rows.length)
										{
											console.log("Delete this");
											this.sql = "DELETE FROM presupuesto_materiales WHERE material_id = " + aux_mat.material_id;
											db.executeSql(this.sql, {})
											.then((rs) =>
											{

											}).catch(e => console.log(e));
										}

									}).catch(e => console.log(e));

								}

							}

							this.sql = "DELETE FROM presupuesto_rubro_material WHERE presupuesto_id = " + this.presupuesto_id + " AND rubro_id = " + rubro.rubro_id;
							db.executeSql(this.sql, {})
							.then((rs) =>
							{

								this.sql = "DELETE FROM presupuesto_rubro WHERE presupuesto_id = " + this.presupuesto_id + " AND rubro_id = " + rubro.rubro_id;
								db.executeSql(this.sql, {})
								.then((rs) =>
								{
									let toast = this.toastCtrl.create({
								      message: 'Rubro eliminado exitosamente',
								      duration: 2000
								    });
								    toast.present();

								}).catch(e => console.log(e));

							}).catch(e => console.log(e));

						}).catch(e => console.log(e));

					})
					.catch(e => console.log(e));

				}
			}
			]
		});
		alert.present();
	}

	get_precio_total(rubro)
	{
		return rubro.precio_unitario_costo * rubro.cantidad;
	}

	get_total_categoria(categoria, rubros)
	{
		let acu:number = 0;
		for (let rubro of rubros)
			if (rubro.categoria_id == categoria.id_servidor)
				acu += (rubro.precio_unitario_costo * rubro.cantidad);

		return acu;
	}

	get_total(rubros)
	{
		let acu:number = 0;
		for (let rubro of rubros)
			acu += (rubro.precio_unitario_costo * rubro.cantidad);

		return acu;
	}

	go_to_presupuesto_seleccion_rubro()
	{
		this.navCtrl.push( PresupuestoSeleccionCategoriaRubrosPage, { presupuesto_id:this.presupuesto_id, show_back:true } );
	}

	go_to_presupuesto_materiales()
	{
		this.navCtrl.push( PresupuestoMaterialesPage, { presupuesto_id:this.presupuesto_id } );
	}

	go_to_presupuesto_mano_de_obra()
	{
		this.navCtrl.push( PresupuestoManoDeObraPage, { presupuesto_id:this.presupuesto_id } );
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

	is_valid_double(val)
	{
		return !isNaN(parseFloat(val)) && isFinite(val);
	}
}
