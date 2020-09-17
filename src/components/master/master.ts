import { Component, Input/*, OnInit*/ } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the MasterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'master',
  templateUrl: 'master.html'
})
export class MasterComponent
{

  @Input() titulo: string;

  constructor
  (
  	public keyboard: Keyboard
  ) 
  {

  }
/*
  ngOnInit()
  {

  }
*/
	menu_toggle_event()
	{
		this.keyboard.close()
	}
}
