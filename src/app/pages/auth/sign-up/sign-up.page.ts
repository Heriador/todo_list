import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public signUpForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly firebaseService: FirebaseService,
    private readonly utilsService: UtilsService
  ) { 
    this.signUpForm = this.formBuilder.group({
      uid: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
  }

  get email(): FormControl<any>{
    return this.signUpForm.controls['email'] as FormControl;
  }

  get password(): FormControl<any>{
    return this.signUpForm.controls['password'] as FormControl;
  }

  get username(): FormControl<any>{
    return this.signUpForm.controls['username'] as FormControl;
  }

  getErrorMessage(control: FormControl): string {

    if(control.touched && control.errors){
      if(control.errors["required"]){
        return 'El campo es requerido';
      }
      if(control.errors["minlength"]){
        return `el campo debe tener al menos ${control.errors["minlength"].requiredLength} caracteres`;
      }
      if(control.errors["email"]){
        return 'correo invalido';
      }
    }

    return '';
  }


  async signUp(){

    if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
    }

    
    console.log(this.signUpForm.value);

    const loading = await this.utilsService.loading();
    await loading.present();

    this.firebaseService.signUp(this.signUpForm.value as User).then(async res => {
        console.log(res);

        await this.firebaseService.updateUser(this.signUpForm.value.username)

        let uid = res.user.uid;
        this.signUpForm.value.uid = uid;

        this.setUserInfo(uid);

        this.utilsService.presentToast({
          message: 'Usuario creado correctamente',
          duration: 2000
        });
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
      .finally(() => {
        loading.dismiss();
      });

    
  }

  async setUserInfo(uid: string){

    if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
    }

    
    console.log(this.signUpForm.value);

    const loading = await this.utilsService.loading();
    await loading.present();

    let path = `users/${uid}`;
    delete this.signUpForm.value.password;


    this.firebaseService.setDocument( path, this.signUpForm.value).then(async res => {
        
        this.utilsService.saveInLocalStorage('user', this.signUpForm.value)
        this.utilsService.routerLink('/home');
        this.signUpForm.reset();

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
      .finally(() => {
        loading.dismiss();
      });

    
  }

}
