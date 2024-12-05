import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo/todo.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { Category } from 'src/app/interfaces/category.interface';
import { Todo } from 'src/app/interfaces/todo.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public createTodoForm: FormGroup;
  public todos: Todo[] = [];
  public filteredTodos: Todo[] = [];
  public categories: Category[] = [];

  isModalOpen: boolean = false;

  user = {} as User;
  loading!: HTMLIonLoadingElement;

  constructor(
    private readonly todoService: TodoService,
    private readonly categoryService: CategoryService,
    private readonly formBuilder: FormBuilder,
    private readonly utilsService: UtilsService
  ) {
    

    this.createTodoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      category: ['', [Validators.required]]
    })

  }

  async ngOnInit() {
    this.loading = await this.utilsService.loading();
  }

  ionViewWillEnter() {
    this.getCategories();
    this.getTodos();
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

  async getTodos(){

    await this.loading.present();

    let sub = this.todoService.getTodos().subscribe({
      next: (todos: Todo[]) => {
        console.log(todos);
        this.todos = todos;
        this.todos = this.todos.map(todo => {
          todo.category = this.categories.find(c => c.id === todo.category)?.name ?? 'Sin categoria';
          return todo;
        });
        this.filteredTodos = this.todos;
        sub.unsubscribe();
      },
      error: (error) => {
        console.error(error);
        this.utilsService.presentToast({
          message: 'Error al obtener las tareas',
          duration: 2000,
          color: 'danger',
          position: 'top'
        })
      }
    });

    sub.add(() => {
      this.loading.dismiss();
    });

  }

  async getCategories(){

    await this.loading.present();

    let sub = this.categoryService.getCategories().subscribe({
      next: (response) => {
        console.log(response);
        this.categories = response;
        sub.unsubscribe();
      },
      error: (error) => {
        console.error(error);
        this.utilsService.presentToast({
          message: 'Error al obtener las categorias',
          duration: 2000,
          color: 'danger',
          position: 'top'
        })
      }
    })

    sub.add(() => {
      this.loading.dismiss();
    })
  }

  async remove(todo: Todo){
    await this.loading.present();
    this.todoService.deleteTodo(todo).then(()=> {
      this.utilsService.presentToast({
        message: 'Tarea eliminada',
        duration: 1000,
        color: 'success',
        position: 'top'
      })

      this.todos = this.todos.filter(t => t.id !== todo.id);
      this.filteredTodos = this.todos;
    })
    .catch((error) => {
      this.utilsService.presentToast({
        message: 'Error al eliminar la tarea',
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
    })
    .finally(() => {
      this.loading.dismiss();
    });
  }

  async addTodo(){

    if(this.createTodoForm.invalid){
      this.createTodoForm.markAllAsTouched();
    }

    await this.loading.present();

    this.todoService.addTodo(this.createTodoForm.value).then((response) => {
      console.log(response);
      this.utilsService.presentToast({
        message: 'Tarea creada',
        duration: 2000,
        color: 'success',
        position: 'top'
      })

      const category = this.categories.find(c => c.id === this.createTodoForm.value.category)?.name ?? 'Sin categoria';

      this.todos.push({id: response.id, ...this.createTodoForm.value, category: category});

      this.createTodoForm.reset({
        title: '',
        description: '',
        category: ''
      });
      this.closeModal()
    })
    .catch((error) => {
      this.utilsService.presentToast({
        message: 'Error al crear la tarea',
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
    })
    .finally(() => {
      this.loading.dismiss();
    });

  }

  async markAsCompleted(todo: Todo){
    await this.loading.present();
    this.todoService.changeCompletedStatus(todo.id).then(() => {
      this.utilsService.presentToast({
        message: 'Tarea completada',
        duration: 2000,
        color: 'success',
        position: 'top'
      })
      this.todos = this.todos.map(t => t.id === todo.id ? {...t, completed: true} : t);
      this.filteredTodos = this.todos;
    })
    .catch((error) => {
      this.utilsService.presentToast({
        message: 'Error al completar la tarea',
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
    })
    .finally(() => {
      this.loading.dismiss();
    });
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
    const query = event.detail.value;
    if(!query){
      this.filteredTodos = this.todos
    }
    else{
      this.filteredTodos = this.todos.filter(todo => todo.category.toLowerCase().includes(query.toLowerCase()));
    }
  }


}
