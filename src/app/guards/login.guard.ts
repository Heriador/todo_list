import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase/firebase.service';
import { UtilsService } from '../services/utils/utils.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly utilsService: UtilsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree > | Promise<boolean | UrlTree> | boolean | UrlTree {



    return new Promise((resolse) => {
      this.firebaseService.getAuth().onAuthStateChanged((auth) => {
        if(!auth){
          resolse(true);
        }
        else{
          this.utilsService.routerLink('/home');
          resolse(false);
        }
      })
    })

  }
}