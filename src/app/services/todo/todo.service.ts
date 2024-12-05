import { Injectable } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo.interface';


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

  constructor(

  ) { }

  getTodos(){
    return this.todos;
  }

  addTodo(todo: Todo){
    this.todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  getTodoById(id: number){
    return this.todos.find(todo => todo.id === id);
  }

  changeCompletedStatus(id: number){
    let todo = this.getTodoById(id);
    if(!todo){
      return null;
    }
    todo.completed = true;
    this.todos = this.todos.map(t => t.id === id ? todo : t);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    return todo;
  }

  deleteTodo(todo: Todo){
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }


}
