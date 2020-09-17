import { Injectable } from '@angular/core';
//import { Presupuesto } from "./../entities/presupuesto";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@Injectable()
export class Connection
{
    sqlite:SQLite;
    sql:string;
    drop_first:boolean = false;
    debug:boolean = true;
    seeders:any =
    {
        presupuesto: false
    };

    database_config:any =
    {
        name: 'construapp.db',
        location: 'default'
    };

    constructor(){}

    query(sql:string, return_something:boolean = false , return_array:boolean = true)
    {
        let array_tmp:Array<Object>;
        let object_tmp:Object;
        this.sqlite = new SQLite();

        this.sqlite.create(this.database_config)
        .then((db: SQLiteObject) =>
        {
            this.sql = "PRAGMA foreign_keys = ON";
            db.executeSql( this.sql, {})
            .then((rs) =>
            {
                if(return_something)
                    if(return_array)
                        for(var i = 0; i < rs.rows.length; i++)
                            array_tmp.push( rs.rows.item(i) );
                    else
                        object_tmp = rs.rows.item(0);
            })
            .catch(e => console.log(e));
            if(this.debug)
                console.log("executing query: "+ this.sql);
        })
        .catch(e => console.log(e));

        if(return_something)
            if(return_array)
                return array_tmp;
            else
                return object_tmp;
    }

    init_db()
    {
        console.log("initdb","function");
        this.sqlite = new SQLite();
        this.sqlite.create(this.database_config)
        .then((db: SQLiteObject) =>
        {
            this.sql = "PRAGMA foreign_keys = ON";
            db.executeSql( this.sql, {})
            .catch(e => console.log(e));
            if(this.debug)
                console.log("executing query: "+ this.sql);


            if(this.drop_first)
            {
                this.sql = "DROP TABLE presupuestos; "+
                            "DROP TABLE categoria_rubro; "+
                            "DROP TABLE presupuesto_rubro; "+
                            "DROP TABLE presupuesto_materiales;"+
                            "DROP TABLE presupuesto_rubro_material";

                db.executeSql( this.sql, {})
                .catch(e => {if(this.debug)console.log(e)} );
                if(this.debug)
                    console.log("executing query: "+ this.sql);
            }



            this.sql = "CREATE TABLE IF NOT EXISTS presupuestos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nombre VARCHAR(45), fecha DATE, cliente VARCHAR(80), observacion TEXT, margen DOUBLE(8,2))";//NOT NULL
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);

            this.sql = "CREATE TABLE IF NOT EXISTS categoria_rubro "+
                        "("+
                            "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
                            "id_servidor INTEGER NOT NULL, "+
                            "presupuesto_id INTEGER NOT NULL, "+// ====> NO SE USA!!
                            "nombre VARCHAR(500), "+
                            "numero INTEGER, "+
                            "FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id) ON DELETE CASCADE"+
                        ")";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);

            this.sql = "CREATE TABLE IF NOT EXISTS presupuesto_rubro "+
                        "("+
                            "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
                            // "id_servidor INTEGER NOT NULL, "+
                            "presupuesto_id INTEGER NOT NULL, "+
                            "categoria_id INTEGER NOT NULL, "+
                            "rubro_id INTEGER NOT NULL, "+
                            "rubro_nombre VARCHAR(500), "+
                            "cantidad DOUBLE(8,2), "+
                            "rubro_unidad_de_medida VARCHAR(30), "+
                            "rubro_precio_mano_de_obra BIGINT, "+
                            "FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id) ON DELETE CASCADE"+
                        ")";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);


            this.sql = "CREATE TABLE IF NOT EXISTS presupuesto_materiales "+
                        "("+
                            "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
                            "presupuesto_id INTEGER NOT NULL, "+
                            "material_id INTEGER NOT NULL, "+
                            "material_nombre VARCHAR(500), "+
                            "precio_unitario BIGINT, "+
                            "unidad_de_medida VARCHAR(30),"+
                            "FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id) ON DELETE CASCADE"+
                        ")";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);



            this.sql = "CREATE TABLE IF NOT EXISTS presupuesto_rubro_material "+
                        "("+
                            "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
                            "presupuesto_rubro_id INTEGER NOT NULL, "+
                            "presupuesto_id INTEGER NOT NULL, "+
                            "rubro_id INTEGER NOT NULL, "+// 2.5.4  rubro_id (de la table presupuesto_rubro. Redundante pero puede servir)
                            "material_id INTEGER NOT NULL, "+
                            "cantidad DOUBLE(8,2), "+
                            "FOREIGN KEY (presupuesto_rubro_id) REFERENCES presupuesto_rubro(id) ON DELETE CASCADE, "+
                            // "FOREIGN KEY (rubro_id) REFERENCES presupuesto_rubro(rubro_id), "+
                            // "FOREIGN KEY (material_id) REFERENCES presupuesto_materiales(id), "+//presupuesto_materiales
                            "FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id) ON DELETE CASCADE"+
                        ")";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);







        })
        .catch(e => {if(this.debug)console.log(e)});

        if(this.seeders.presupuesto)
            this.seed_presupuestos();



    }

    seed_presupuestos()
    {
        this.sqlite = new SQLite();
        this.sqlite.create(this.database_config)
        .then((db: SQLiteObject) =>
        {
            this.sql = "INSERT INTO presupuestos (id, nombre, fecha, cliente, observacion, margen) VALUES(1, 'Presupuesto 1', '2017-01-05', 'cliente A', 'una obs 1', 123);";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);
            this.sql = "INSERT INTO presupuestos (id, nombre, fecha, cliente, observacion, margen) VALUES(2, 'Presupuesto 2', '2017-05-05', 'cliente B', 'una obs 2', 12343);";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);
            this.sql = "INSERT INTO presupuestos (id, nombre, fecha, cliente, observacion, margen) VALUES(3, 'Presupuesto 3', '2017-03-15', 'cliente C', 'una obs 3', 4573);";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);
            this.sql = "INSERT INTO presupuestos (id, nombre, fecha, cliente, observacion, margen) VALUES(4, 'Presupuesto 4', '2017-01-17', 'cliente D', 'una obs 4', 47898);";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);
            this.sql = "INSERT INTO presupuestos (id, nombre, fecha, cliente, observacion, margen) VALUES(5, 'Presupuesto 5', '2017-04-22', 'cliente E', 'una obs 5', 456158);";
            db.executeSql( this.sql, {})
            .catch(e => {if(this.debug)console.log(e)});
            if(this.debug)
                console.log("executing query: "+ this.sql);
        })
        .catch(e => {if(this.debug)console.log(e)});
    }

}
