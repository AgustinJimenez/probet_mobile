import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { PresupuestoProvider } from "./../../../providers/presupuesto";
//import { PresupuestoSeleccionRubrosPage } from "./../presupuesto-seleccion-rubros/presupuesto-seleccion-rubros";
import { PresupuestoCostoPage } from "./../presupuesto-costo/presupuesto-costo";
import { RoutesProvider } from "./../../../providers/config/routes";
import { LoadingController } from 'ionic-angular';
import { ToastProvider } from "./../../../providers/config/toast-provider";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@IonicPage()
@Component({
  selector: 'page-presupuesto-seleccion-categoria-rubros',
  templateUrl: 'presupuesto-seleccion-categoria-rubros.html',
})
export class PresupuestoSeleccionCategoriaRubrosPage
{
	presupuesto_id: number;
	showBack:boolean;
	categorias_rubros:any;
	mostrar_lista = null;
	sqlite:SQLite;
  	sql:string;
  	debug:boolean = false;
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public presupuesto_service: PresupuestoProvider,
		public alertCtrl: AlertController,
		public routes: RoutesProvider,
		public http: Http,
		public toast: ToastProvider,
		public loadingCtrl: LoadingController,
		public connection: Connection,
		public viewCtrl: ViewController
	)
	{
		console.log("===================================================================");
		console.log("================MOSTRANDO VISTA DE RUBROS=====================");
		console.log("===================================================================");
		if(this.debug)
			this.presupuesto_id = 5;
		else
			this.presupuesto_id = this.navParams.get("presupuesto_id");
		this.showBack = this.navParams.get("show_back");
		this.get_categorias_rubros();
	}

	ionViewDidLoad()
	{
		if (!this.showBack)
			this.viewCtrl.showBackButton(false);
	}

	get_categorias_rubros()
	{
		let loading = this.loadingCtrl.create();
	    let url = this.routes.seleccion_categorias_with_rubros_url + "?" + this.routes.api_token;
	    loading.present();
	    this.http.get( url ).map( res => res.json() ).subscribe(elements =>
	    {
			this.categorias_rubros = elements;

			for (let categoria of this.categorias_rubros)
			{
				//console.log("categorias");
				//console.log(categoria);
				for (let rubro of categoria.rubros)
				{
					this.sqlite = new SQLite();

					this.sqlite.create(this.connection.database_config)
					.then((db: SQLiteObject) =>
					{
						//let tmp_categoria_id:number;

						this.sql = "SELECT * FROM presupuesto_rubro WHERE presupuesto_id = " + this.presupuesto_id + " AND categoria_id = "+categoria.id + " AND rubro_id = " + rubro.id;
						db.executeSql(this.sql, {})
						.then((rs) =>
						{
							if (rs.rows.length)
							{
								rubro.disabled = true;
								rubro.btn = 'AGREGADO';
							}
							else
							{
								rubro.disabled = null;
								rubro.btn = 'AGREGAR';
							}
						}).catch(e => console.log(e));

					})
					.catch(e => console.log(e));
				}
			}

	      loading.dismiss();
	      	console.log("===================================================================");
			console.log("================TERMINO DE CARGAR LOS RUBROS=====================");
			console.log("===================================================================");
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


	rubro_cantidad_prompt(categoria_rubro, rubro)
	{
		let alert = this.alertCtrl.create
		({
			title: 'Cantidad',
			subTitle: rubro.nombre + ' ('+rubro.unidad_medida+')',
			inputs: [
			{
				name: 'cantidad',
				placeholder: 'Cantidad',
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
					if (this.is_valid_double(data.cantidad) && data.cantidad != "")
					{
						let categoria_exist:number = 0;
						let material_exist:number = 0;
						if(data.cantidad == "")
							data.cantidad = 0;

						rubro.disabled = true;
						rubro.btn = 'AGREGADO';

						let tmp_id : number = 0;

						this.sqlite = new SQLite();

					    this.sqlite.create(this.connection.database_config)
					    .then((db: SQLiteObject) =>
					    {
					    	let tmp_categoria_id:number;

							this.sql = "SELECT * FROM categoria_rubro WHERE id_servidor = "+categoria_rubro.id;
							console.log( "executing query: "+this.sql );
							db.executeSql(this.sql, {})
							.then((rs) =>
							{
								categoria_exist = rs.rows.length;
								if(categoria_exist)
								{
									tmp_categoria_id = categoria_rubro.id;
									console.log('this rubro log');
									console.log(rubro);
									this.sql = "INSERT INTO presupuesto_rubro (presupuesto_id, categoria_id, rubro_id, rubro_nombre, cantidad, rubro_unidad_de_medida, rubro_precio_mano_de_obra) "+
													"VALUES("+this.presupuesto_id+", '"+tmp_categoria_id+"', "+rubro.id+", '"+rubro.nombre+"', "+data.cantidad+", '"+rubro.unidad_medida+"', "+rubro.precio_mano_de_obra+")";
										db.executeSql(this.sql, {})
										.then((rs) =>
										{
											tmp_id = rs.insertId;

											for (let material of rubro.rubro_materiales)
											{
												this.sql = "SELECT * FROM presupuesto_materiales WHERE presupuesto_id = "+ this.presupuesto_id +" AND material_id = "+ material.material_id;
												db.executeSql(this.sql, {})
												.then((rs) =>
												{
													material_exist = rs.rows.length;

													if(material_exist <= 0)
													{
														console.log('entro en el material_exist');
														this.sql = "INSERT INTO presupuesto_materiales (presupuesto_id, material_id, material_nombre, precio_unitario, unidad_de_medida) "+"VALUES("+this.presupuesto_id+", "+material.material_id+", '"+material.material.nombre+"', "+material.material.precio_unitario+", '"+material.material.unidad_medida+"')";
														db.executeSql(this.sql, {})
														.then((rs) =>
														{
                              console.log('Material cantidad ' + material.cantidad);
															this.sql = "INSERT INTO presupuesto_rubro_material (presupuesto_rubro_id, presupuesto_id, rubro_id, material_id, cantidad) "+"VALUES("+tmp_id+", "+this.presupuesto_id+", "+rubro.id+", "+material.material_id+", "+material.cantidad+")";
															db.executeSql(this.sql, {})
															.catch(e => console.log(e));

														})
														.catch(e => console.log(e));
													}
													else
													{
														this.sql = "INSERT INTO presupuesto_rubro_material (presupuesto_rubro_id, presupuesto_id, rubro_id, material_id, cantidad) "+"VALUES("+tmp_id+", "+this.presupuesto_id+", "+rubro.id+", "+material.material_id+", "+material.cantidad+")";
														db.executeSql(this.sql, {})
														.catch(e => console.log(e));
													}

												}).catch(e => console.log(e));

											}

										})
										.catch(e => console.log(e));

								}
								else
								{
									this.sql = "INSERT INTO categoria_rubro (id_servidor, presupuesto_id, nombre, numero) VALUES("+categoria_rubro.id+", "+this.presupuesto_id+", '"+categoria_rubro.nombre+"', "+categoria_rubro.numero+")";
									console.log( "executing query: "+this.sql );
									db.executeSql(this.sql, {})
									.then((rs) =>
									{

										tmp_categoria_id = categoria_rubro.id;

										this.sql = "INSERT INTO presupuesto_rubro (presupuesto_id, categoria_id, rubro_id, rubro_nombre, cantidad, rubro_unidad_de_medida, rubro_precio_mano_de_obra) "+
														"VALUES("+this.presupuesto_id+", '"+tmp_categoria_id+"', "+rubro.id+", '"+rubro.nombre+"', "+data.cantidad+", '"+rubro.unidad_medida+"', "+rubro.precio_mano_de_obra+")";
											db.executeSql(this.sql, {})
											.then((rs) =>
											{
												tmp_id = rs.insertId;

												for (let material of rubro.rubro_materiales)
												{
													this.sql = "SELECT * FROM presupuesto_materiales WHERE material_id = "+material.material_id;
													db.executeSql(this.sql, {})
													.then((rs) =>
													{
														material_exist = rs.rows.length;

														if(material_exist <= 0)
														{
															console.log('entro en el material_exist');
															this.sql = "INSERT INTO presupuesto_materiales (presupuesto_id, material_id, material_nombre, precio_unitario, unidad_de_medida) "+"VALUES("+this.presupuesto_id+", "+material.material_id+", '"+material.material.nombre+"', "+material.material.precio_unitario+", '"+material.material.unidad_medida+"')";
															db.executeSql(this.sql, {})
															.then((rs) =>
															{
																this.sql = "INSERT INTO presupuesto_rubro_material (presupuesto_rubro_id, presupuesto_id, rubro_id, material_id, cantidad) "+"VALUES("+tmp_id+", "+this.presupuesto_id+", "+rubro.id+", "+material.material_id+", "+material.cantidad+")";
																db.executeSql(this.sql, {})
																.catch(e => console.log(e));

															})
															.catch(e => console.log(e));
														}
														else
														{
															this.sql = "INSERT INTO presupuesto_rubro_material (presupuesto_rubro_id, presupuesto_id, rubro_id, material_id, cantidad) "+"VALUES("+tmp_id+", "+this.presupuesto_id+", "+rubro.id+", "+material.material_id+", "+material.cantidad+")";
															db.executeSql(this.sql, {})
															.catch(e => console.log(e));
														}

													}).catch(e => console.log(e));

												}

											})
											.catch(e => console.log(e));

									})
									.catch(e => console.log(e));

								}

							}).catch(e => console.log(e));

					    })
					    .catch(e => console.log(e));
					}
					else
					{
						this.showAlert();
					}

				}
			}
			]
		});
		alert.present();
	}

	is_valid_double(val)
	{
		return !isNaN(parseFloat(val)) && isFinite(val);
	}

	showAlert()
	{
		let alert = this.alertCtrl.create({
			title: 'Atención!',
			subTitle: 'El valor de cantidad ingresado es incorrecto',
			buttons: ['Aceptar']
		});
		alert.present();
	}

	go_to_presupuesto_costo()
	{
		if (!this.showBack)
		{
			this.navCtrl.push( PresupuestoCostoPage , {presupuesto_id:this.presupuesto_id, show_back:this.showBack}).then(() => {
				const index = this.navCtrl.getActive().index;
		  		this.navCtrl.remove(0, index);
			});
		}
		else
		{
			this.navCtrl.pop();
		}

	}

}
