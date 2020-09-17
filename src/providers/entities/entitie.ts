import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Connection } from "./../config/database";
export abstract class BaseEntitie 
{
     connection: Connection;
     sqlite:SQLite;
     abstract table:string;
     abstract attributes:string;
     where:string = "";
     orderby:string = "";
     class_name:string;
     attributes_list:Array<string>;
     debug:boolean;
    constructor()
    {
      this.debug = true;

      this.connection = new Connection();
      this.sqlite = new SQLite();
      this.class_name = BaseEntitie.constructor.name;
      this.sqlite.create(this.connection.database_config)
      .then((db: SQLiteObject) => 
      {
        let sql = "CREATE TABLE IF NOT EXISTS "+this.table+" ("+this.attributes+")";
        db.executeSql(sql, {});
        console.log("executing query: "+sql);
      });
    }
    inicialize_child()
    {
      this.attributes_list = this.get_attributes_list();
    }
    atributes_on_string_by_coma()
    {
      return this.implode(', ' , this.attributes_list );
    }
    get_attributes_list():Array<string>
    {  
      let attr_list:Array<string> = [];
      //let array_tmp;
      let attr_prop = this.explode(',', this.attributes);
      for(let element of attr_prop)
        attr_list.push( this.explode( " ", element ).filter(element => element != '')[0] ); 
      
      return attr_list;
    }
    implode(glue:string, array:Array<String>):string
    {
      return array.map(o => o).join(glue);
    }

    explode(separator:string = ",", any_string:string = "error,no,params"):Array<string>
    {
      return any_string.split(separator);
    }

    whereRaw(condition:string):any
    {
      this.where = condition;
      return this;
    }
    orderByRaw(order:string):any
    {
      this.orderby = order;
      return this;
    }

    get(attributes = [], sql:string = ''):any
    {
        //let class_name = this.class_name;
        let columns:string;
        let array_tmp:Array<any> = [];

        if(this.where != '')
            this.where = "WHERE "+this.where;

        if(this.orderby != '')
            this.orderby = "ORDER BY "+this.orderby;

        if(attributes.length)
            columns = this.implode(', ', attributes);
        else
            columns = "*";

        if(sql=='')
            sql = 'SELECT '+columns+' FROM '+this.table+" "+this.where+" "+this.orderby;
        console.log( "executing query: "+sql );
        console.log("class name is: "+this.class_name);
        this.clean_query_attributes();

        this.sqlite.create(this.connection.database_config)
        .then((db: SQLiteObject) => 
        {
            db.executeSql(sql, [])
            .then((rs) => 
            {
                if(rs.rows.length) 
                    for(var i = 0; i < rs.rows.length; i++)
                        array_tmp.push( rs.rows.item(i) );   
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
        return array_tmp;
  }

  clean_query_attributes():void
  {
      this.where = this.orderby = "";
  }

    
  
    
}