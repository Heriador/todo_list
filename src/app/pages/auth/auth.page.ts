import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {

  public loginForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly firebaseService: FirebaseService,
    private readonly utilsService: UtilsService
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email(): FormControl<any>{
    return this.loginForm.controls['email'] as FormControl;
  }

  get password(): FormControl<any>{
    return this.loginForm.controls['password'] as FormControl;
  }

  getErrorMessage(control: FormControl): string {

    if(control.touched && control.errors){
      if(control.errors["required"]){
        return 'El campo es requerido';
      }
      if(control.errors["email"]){
        return 'correo invalido';
      }
    }

    return '';
  }

  async login(){

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
    }

    
    const loading = await this.utilsService.loading();
    await loading.present();

    this.firebaseService.signIn(this.loginForm.value).then(res => {
      console.log(res);

      this.setUserInfo(res.user.uid);
    }).catch(error => {
      console.error(error);
      this.utilsService.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'top',
        icon: 'alert-circle-outline'
      })
    })
    .finally(() => {
      loading.dismiss();
    });
    
  }

  async setUserInfo(uid: string){

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
    }


    let path = `users/${uid}`;


    this.firebaseService.getDocument(path).then((value: DocumentData | undefined) => {
        if (value) {
            const user = value as User;
            this.utilsService.saveInLocalStorage('user', user);
            this.utilsService.routerLink('/home');
            this.loginForm.reset();

            this.utilsService.presentToast({
              message: `Bienvenido ${user.username}`,
              duration: 2000,
              position: 'top',
              icon: 'person-circle-outline'
            });
        } else {
            throw new Error('User data is undefined');
        }
      })
      .catch(error => {
        console.error(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'top',
          icon: 'alert-circle-outline'
        })
      })    
  }

}
