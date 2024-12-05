import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Todo } from 'src/app/interfaces/todo.interface';
import { getFirestore, addDoc, collection } from '@angular/fire/firestore';
import { UtilsService } from '../utils/utils.service';
import { User } from 'src/app/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: Todo[] = JSON.parse(localStorage.getItem("todos") || '[]').length > 0 ? JSON.parse(localStorage.getItem("todos") || '[]') : [
    {id: 1, title: 'Todo 1', category: "trabajo" ,description: "wast" ,completed: false},
    {id: 2, title: 'Todo 2', category: "trabajo", description: "wast", completed: false},
    {id: 3, title: 'Todo 3', category: "trabajo", description: "wast", completed: false},
    {id: 4, title: 'Todo 4', category: "trabajo", description: "wast", completed: false},
    {id: 5, title: 'Todo 5', category: "trabajo",  description: "wast", completed: true},
  ];

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
    this.todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(this.todos));

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
