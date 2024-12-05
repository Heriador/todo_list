import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo/todo.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { Category } from 'src/app/interfaces/category.interface';
import { Todo } from 'src/app/interfaces/todo.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public createTodoForm: FormGroup;
  public todos: Todo[];
  public categories: Category[];

  isModalOpen: boolean = false;

  constructor(
    private readonly todoService: TodoService,
    private readonly categoryService: CategoryService,
    private readonly formBuilder: FormBuilder
  ) {
    this.todos = this.todoService.getTodos();
    this.categories = this.categoryService.getCategories();

    this.createTodoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      category: ['', [Validators.required]]
    })


  }

  get title(): FormControl<any>{
    return this.createTodoForm.controls['title'] as FormControl;
  }

  get description(): FormControl<any>{
    return this.createTodoForm.controls['description'] as FormControl;
  }

  get category(): FormControl<any>{
    return this.createTodoForm.controls['category'] as FormControl;
  }

  getErrorMessage(control: FormControl): string{
    if(control.touched && control.errors){
      if(control.errors["required"]){
        return 'Campo requerido';
      }
      if(control.errors["minlength"]){
        return `Campo debe tener al menos ${control.errors["minlength"].requiredLength} caracteres`;
      }
      if(control.errors["maxlength"]){
        return `Campo debe tener menos de ${control.errors["maxlength"].requiredLength} caracteres`;
      }
    }

    return '';
  }

  remove(todo: Todo){
    this.todoService.deleteTodo(todo);
    this.todos = this.todoService.getTodos();
  }

  addTodo(){
    if(this.createTodoForm.valid){
      let todo: Todo = {
        id: this.todos.length + 1,
        ...this.createTodoForm.value,
        completed: false
      }
      this.todoService.addTodo(todo);
      this.todos = this.todoService.getTodos();
      this.createTodoForm.reset();
      this.closeModal();
    }
  }

  markAsCompleted(todo: Todo){
    this.todoService.changeCompletedStatus(todo.id);
    this.todos = this.todoService.getTodos();
  }

  openModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
    this.createTodoForm.reset({
      title: '',
      description: '',
      category: ''
    });
  }

  onSearchChange(event: any){
    const query = event.target.value.toLowerCase();
    this.todos = this.todoService.getTodos().filter(todo => todo.category.toLowerCase().includes(query));
  }


}
