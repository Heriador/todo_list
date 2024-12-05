import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase/firebase.service';
import { UtilsService } from '../services/utils/utils.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly utilsService: UtilsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree > | Promise<boolean | UrlTree> | boolean | UrlTree {

    let user = this.utilsService.getFromLocalStorage('user');


    return new Promise((resolse) => {
      this.firebaseService.getAuth().onAuthStateChanged((auth) => {
        if(auth && user){
          resolse(true);
        }
        else{
          this.utilsService.routerLink('/login');
          resolse(false);
        }
      })
    })

  }
}