import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';
@Injectable()
export class ProveedoresProvider 
{
	constructor
	(
		private iab: InAppBrowser,
		public platform: Platform
	) 
	{
		
	}

	open_browser(url)
	{
		this.iab.create(url);
		//browser.executeScript();
		//browser.insertCSS();
		//browser.close();
	}

	open_mail(email) 
	{
		window.open(`mailto:${email}`, '_system');
	}

	open_map(latitude, longitude)
	{
		let destination = latitude + ',' + longitude;
		if(this.platform.is('ios'))
	{
	window.open('maps://?q=' + destination, '_system');
	}
	else 
	{
		let label = encodeURI('My Label');
		window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
	}

	}
}
