import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the InicioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  pages: Array<{title: string, component: any, index: number, image: string, sub_menu_of_page: number, has_sub_menu: boolean}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events) {
      this.pages = this.events.publish('getPages')[0];

  }

  ionViewDidLoad() {
    
  }

  openPage(page){

    this.events.publish('openPage',page);
  }

}
