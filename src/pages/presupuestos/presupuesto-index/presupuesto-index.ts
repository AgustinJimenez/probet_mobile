import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import { PresupuestoCreatePage } from "./../presupuesto-create/presupuesto-create";
import { PresupuestoCostoPage } from "./../presupuesto-costo/presupuesto-costo";
import { PresupuestoEditPage } from "./../presupuesto-edit/presupuesto-edit";
import { PresupuestoOfertaPage } from "./../presupuesto-oferta/presupuesto-oferta";
//import { Presupuesto } from "./../../../providers/entities/presupuesto";
import { PresupuestoProvider } from "./../../../providers/presupuesto";
import { DatePipe } from '@angular/common';
import { ToastProvider } from "./../../../providers/config/toast-provider";
import { Connection } from "./../../../providers/config/database";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@IonicPage()
@Component({
  selector: 'page-presupuesto-index',
  templateUrl: 'presupuesto-index.html',
})
export class PresupuestoIndexPage
{
  public presupuestos:Array<Object> = [];
  sqlite:SQLite;
  sql:string;
  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    public presupuesto_provider: PresupuestoProvider,
    public events: Events,
    public datepipe: DatePipe,
    public connection: Connection,
    public toast: ToastProvider,
    )
  {

    this.sqlite = new SQLite();
  }

  ionViewDidLoad() {}
  ionViewWillEnter()
  {
    this.get_presupuestos();
  }

  go_to_create_presupuesto()
  {
  	this.navCtrl.push( PresupuestoCreatePage );
  }

  go_to_presupuesto_costo(presupuesto)
  {
    this.navCtrl.push( PresupuestoCostoPage , {presupuesto_id:presupuesto.id, show_back:true});
  }

  go_to_presupuesto_editar(presupuesto)
  {
    this.navCtrl.push( PresupuestoEditPage , {presupuesto_id:presupuesto.id});
  }

  go_to_presupuesto_oferta(presupuesto)
  {
    this.navCtrl.push( PresupuestoOfertaPage , {presupuesto_id:presupuesto.id});
  }

  get_presupuestos()
  {
    //let array_tmp:Array<any> = [];

    this.sql = "SELECT id, fecha, nombre, cliente, observacion FROM presupuestos ORDER BY fecha DESC";
    //console.log( "executing query: "+this.sql );
    //console.log(this.connection.database_config);
    this.sqlite.create(this.connection.database_config)
    .then((db: SQLiteObject) =>
    {
        db.executeSql(this.sql, [])
        .then((rs) =>
        {
          this.presupuestos = [];
            if(rs.rows.length)
                for(var i = 0; i < rs.rows.length; i++)
                    this.presupuestos.push( rs.rows.item(i) );
            else
              this.toast.show_message('no_results');

        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

}
