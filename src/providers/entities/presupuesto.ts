//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
//import { Connection } from "./../config/database";
import { BaseEntitie } from "./entitie";
export class Presupuesto extends BaseEntitie
{
    id: number;
    nombre: string;
    fecha: string;
    cliente: string;
    observacion: string;
    margen: number;
    

    table = "presupuestos";
    attributes = "id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(45), fecha DATE, cliente VARCHAR(80), observacion TEXT, margen INT";
    debug = true;
    un_attribute: string;
    constructor() 
    { 
        super();
        this.inicialize_child();
    }

    run()
    {}

  


}
/*
import {Table, Column, PrimaryGeneratedColumn} from "ionic-orm-2";
@Table()
export class Presupuesto 
{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("date")
    fecha: string;

    @Column()
    cliente: string;

    @Column("text")
    observacion: string;

    @Column("int")
    margen: number;
}
*/