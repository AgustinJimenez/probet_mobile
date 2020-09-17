import { Component, Input } from '@angular/core';

/**
 * Generated class for the MaterialProveedoresComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'material-proveedores',
  templateUrl: 'material-proveedores.html'
})
export class MaterialProveedoresComponent {

  @Input() imagen: string;
  @Input() nombre: string;
  @Input() direccion: string;
  @Input() latitud: string;
  @Input() longitud: string;
  @Input() nro_telefono: string;
  @Input() email: string;
  @Input() direccion_web: string;


  constructor() 
  {
  }

}
