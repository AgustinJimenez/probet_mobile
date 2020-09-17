import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-presupuesto-oferta',
  templateUrl: 'presupuesto-oferta.html',
})
export class PresupuestoOfertaPage {

	presupuesto_id:number;
	presupuesto:any =
	{
		fecha:"",
		nombre:"",
		cliente:"",
		observacion:"",
		margen:0
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
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public connection: Connection,
		public toastCtrl: ToastController
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
		this.get_data_presupuesto();
	}

	get_data_presupuesto()
	{
		this.sqlite.create(this.connection.database_config)
		.then((db: SQLiteObject) =>
		{
			this.sql = "SELECT * FROM presupuestos WHERE id = " + this.presupuesto_id;
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

                    let cantidad_aux:any;
                    cantidad_aux = rubro_material.cantidad;

										this.sql = "SELECT * FROM presupuesto_materiales WHERE presupuesto_id = " + this.presupuesto_id + " AND material_id = " + rubro_material.material_id + " LIMIT 1";
										db.executeSql(this.sql, {})
										.then((rs) =>
										{
											let material:any;
											let aux_total:number = 0;
											let rubro_precio_unitario:number = 0;
											if (rs.rows.length)
											{
												material = rs.rows.item(0);
												aux_total = (material.precio_unitario * cantidad_aux);
												rubro_precio_unitario = (aux_total + rubro.precio_unitario_costo);
												rubro.precio_unitario_costo = rubro_precio_unitario;
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

	get_precio_unit(rubro, presupuesto)
	{
		return rubro.precio_unitario_costo * presupuesto.margen;
	}

	get_precio_total(rubro, presupuesto)
	{
		return (rubro.precio_unitario_costo * presupuesto.margen) * rubro.cantidad;
	}

	get_total_categoria(categoria, rubros, presupuesto)
	{
		let acu:number = 0;
		for (let rubro of rubros)
			if (rubro.categoria_id == categoria.id_servidor)
				acu += (rubro.precio_unitario_costo * presupuesto.margen) * rubro.cantidad;

		return acu;
	}

	get_total(rubros, presupuesto)
	{
		let acu:number = 0;
		for (let rubro of this.rubros)
			acu += (rubro.precio_unitario_costo * presupuesto.margen) * rubro.cantidad;

		return acu;
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
}
