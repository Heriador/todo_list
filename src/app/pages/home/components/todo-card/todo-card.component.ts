import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo.interface';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent {

  @Input() todo!: Todo;
  @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter();
  @Output() completedTodo: EventEmitter<Todo> = new EventEmitter();

  constructor() { }



  delete(){
    this.deleteTodo.emit(this.todo);
  }

  markAsCompleted(){
    this.completedTodo.emit(this.todo);
  }

}
