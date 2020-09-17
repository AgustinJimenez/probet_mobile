import { Injectable } from '@angular/core';
//import { Presupuesto } from "./entities/presupuesto";
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Connection } from "./config/database";
//import { Connection } from "./config/database";

//import { createConnection } from "ionic-orm";

@Injectable()
export class PresupuestoProvider 
{
  connection: Connection;
  //sqlite:SQLite;
  sql:string;
  presupuestos = [];
	constructor
  (
  )
	{
	}

    run()
    {
    }

  guardar_rubro_cantidad(cantidad, categoria_rubro, rubro)
  {
    console.log("Recibido, cantidad="+cantidad);
    console.log(categoria_rubro);
    console.log(rubro);
    this.connection.query(this.sql);
  }

  presupuesto_create(presupuesto)
  {
    
  }
















}
