import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private readonly loadingController: LoadingController,
    private readonly toastController: ToastController,
    private readonly router: Router
  ) { }

  loading(){
    return this.loadingController.create({spinner: 'circles'});
  }

  async presentToast(opts?: ToastOptions ) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  routerLink(url: string){
    this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any){
    localStorage.setItem(key,JSON.stringify(value));
  }

  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

}
