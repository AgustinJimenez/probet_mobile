import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastProvider 
{
  toast:ToastController;
  message:any = 
  {
    no_server_available:
    {
      message: 'Hay problemas para conectarse al servidor.',
      duration: 5500,
      position: 'middle',
      cssClass: 'toast-error-message',
      dismissOnPageChange: true,
      showCloseButton:true,
      closeButtonText:"CERRAR"
    },
    no_results:
    {
      message: 'No se encontraron registros.',
      duration: 5500,
      position: 'middle',
      cssClass: 'toast-error-message',
      dismissOnPageChange: true,
      showCloseButton:true,
      closeButtonText:"CERRAR"
    }


  }
  



  constructor
  (
    public toastCtrl: ToastController,
  )
  {
  }

  show_message( message_obj )
  {
    return this.toastCtrl.create( this.message[message_obj] ).present();
  }

}
