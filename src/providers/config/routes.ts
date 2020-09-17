import { Injectable } from '@angular/core';

@Injectable()
export class RoutesProvider
{
  //api_url = 'http://192.168.0.37:8000/es/api/v1/';
  api_url = 'http://construapp.zentcode.com/es/api/v1/';


  materiales_index_url = this.api_url + "materiales/index";
  material_proveedores_url = this.api_url + "materiales/material/proveedores/";
  proveedores_index_url = this.api_url + "proveedores/index";
  proveedor_url = this.api_url + "proveedores/proveedor/";
  seleccion_categorias_with_rubros_url = this.api_url + "categorias_rubros";
  api_token:string = "api_token=okeJ1R6dO1d78RjiLJcD6wllcRulFQXTpLCdP9gMwnPhYX7WiX6AH2FkezKM";

  tmp:any;
  constructor
  (
  )
  {
  }
}
