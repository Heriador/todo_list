import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from 'src/app/interfaces/category.interface';
import { UtilsService } from '../utils/utils.service';
import { User } from 'src/app/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  user = {} as User;

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly utilsService: UtilsService
  ) {
    this.user = this.utilsService.getFromLocalStorage('user');
  }

  private getCategoriesCollection(){
    return this.firestore.collection('users').doc(this.user.uid).collection<Category>('categories');
  }

  getCategories(){

    return this.getCategoriesCollection().valueChanges({ idField: 'id' });
  }

 
  getCategoryById(uid: string){
    return this.getCategoriesCollection().doc(uid).valueChanges();
  }

  addCategory(category: Category){

    return this.getCategoriesCollection().add(category);
  }

  updateCategory(category: Category){

    return this.getCategoriesCollection().doc(category.id).update(category);
  }

  deleteCategory(category: Category){

    return this.getCategoriesCollection().doc(category.id).delete();
  }
}
