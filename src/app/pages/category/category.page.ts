import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/interfaces/category.interface';
import { User } from 'src/app/interfaces/user.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  public categories: Category[] = [];

  public createCategoryForm: FormGroup
  public updateCategoryForm: FormGroup

  isModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;
  private selectedCategory: Category | null = null;

  loading!: HTMLIonLoadingElement;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly utilsService: UtilsService
  ) {

    this.createCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]]
    })

    this.updateCategoryForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]]
    })

  }

  async ngOnInit() {
    this.loading = await this.utilsService.loading();
  }

  ionViewWillEnter() {
    this.getCategories();
  }

  get nameCreate(): FormControl{
    return this.createCategoryForm.controls['name'] as FormControl;
  }

  get descriptionCreate(): FormControl{
    return this.createCategoryForm.controls['description'] as FormControl;
  }

  get nameUpdate(): FormControl{
    return this.updateCategoryForm.controls['name'] as FormControl;
  }

  get descriptionUpdate(): FormControl{
    return this.updateCategoryForm.controls['description'] as FormControl;
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

  async addCategory(){
    if(this.createCategoryForm.invalid){
      this.createCategoryForm.markAllAsTouched();
      
    }
    await this.loading.present();

    this.categoryService.addCategory(this.createCategoryForm.value).then((response) => {
      console.log(response);
      this.utilsService.presentToast({
        message: 'Categoria creada',
        duration: 2000,
        color: 'success',
        position: 'top'
      })

      this.categories.push({id: response.id, ...this.createCategoryForm.value});


      this.createCategoryForm.reset({
        name: '',
        description: ''
      });
      this.closeModal()
    })
    .catch((error) => {
      this.utilsService.presentToast({
        message: 'Error al crear la categoria',
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
    })
    .finally(() => {
      this.loading.dismiss();
    });
  }

  async getCategories(){

    const loading = await this.utilsService.loading();
    await loading.present();

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
      loading.dismiss();
    })
  }

  async deleteCategory(category: Category){

    await this.loading.present();
    this.categoryService.deleteCategory(category).then(() => {
      this.utilsService.presentToast({
        message: 'Categoria eliminada',
        duration: 2000,
        color: 'success',
        position: 'top'
      })
      this.categories = this.categories.filter(c => c.id !== category.id);
    })
    .catch(() => {
      this.utilsService.presentToast({
        message: 'Error al eliminar la categoria',
        duration: 2000,
        color: 'danger',
        position: 'top'
      })
    })
    .finally(() => {
      this.loading.dismiss();
    });
  }

  async updateCategory(){
    if(this.updateCategoryForm.invalid){
      this.updateCategoryForm.markAllAsTouched();
    }


    await this.loading.present();
    this.categoryService.updateCategory(this.updateCategoryForm.value)
      .then(() => {
        this.utilsService.presentToast({
          message: 'Categoria actualizada',
          duration: 2000,
          color: 'success',
          position: 'top'
        })
        this.updateCategoryForm.reset({
          name: '',
          description: ''
        });
        this.closeUpdateModal();
        this.getCategories();
      })
      .catch((error) => {
        console.error(error);
        this.utilsService.presentToast({
          message: 'Error al actualizar la categoria',
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

  openUpdateModal(category: Category){
    this.isUpdateModalOpen = true;
    this.selectedCategory = category;
    this.updateCategoryForm.patchValue({
      id: category.id,
      name: category.name,
      description: category.description
    })
  }

  closeModal(){
    this.isModalOpen = false;
  }

  closeUpdateModal(){
    this.isUpdateModalOpen = false;
    this.selectedCategory = null;
    this.updateCategoryForm.reset({
      name: '',
      description: ''
    })
  }

}
