import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Todo } from 'src/app/interfaces/todo.interface';
import { UtilsService } from '../utils/utils.service';
import { User } from 'src/app/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  user = {} as User;

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly utilsService: UtilsService
  ) { 
    this.user = this.utilsService.getFromLocalStorage('user');
  }

  private getTodosCollection(){
    return this.firestore.collection('users').doc(this.user.uid).collection<Todo>('todos');
  }

  getTodos(){
    return this.getTodosCollection().valueChanges({ idField: 'id' });
  }

  addTodo(todo: Todo){

    return this.getTodosCollection().add(todo);
  }

  getTodoById(uid: string){
    return this.getTodosCollection().doc(uid).valueChanges();
  }

  changeCompletedStatus(uid: string){
    return this.getTodosCollection().doc(uid).update({completed: true});
  }

  deleteTodo(todo: Todo){
    return this.getTodosCollection().doc(todo.id).delete();
  }


}
