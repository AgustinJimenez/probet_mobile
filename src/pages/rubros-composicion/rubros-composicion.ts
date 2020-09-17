import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-rubros-composicion',
  templateUrl: 'rubros-composicion.html',
})
export class RubrosComposicionPage {

	rubro:any;
	constructor
	(
		public navCtrl: NavController, 
		public navParams: NavParams
	)
	{
		this.rubro = this.navParams.get("rubro");
	}

	ionViewDidLoad()
	{
		// console.log(this.rubro);
	}

	get_material_total(material)
	{
		return (material.material.precio_unitario * material.cantidad);
	}

	get_total(rubro)
	{
		let acu:number = Number(rubro.precio_mano_de_obra);
		for (let material of rubro.rubro_materiales)
			acu += (Number(material.material.precio_unitario) * Number(material.cantidad));

		return acu;
	}
}