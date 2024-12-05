import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../../interfaces/user.interface';
import { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private readonly firebaseAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
    private readonly utilsService: UtilsService
  ) { }

  getAuth(){
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/login');
  }

  updateUser(displayName: string) {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      return updateProfile(currentUser, { displayName });
    } else {
      return Promise.reject('No user is currently signed in.');
    }
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

}
