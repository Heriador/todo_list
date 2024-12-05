import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/interfaces/category.interface';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  public categories: Category[];

  public createCategoryForm: FormGroup
  public updateCategoryForm: FormGroup

  isModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;
  private selectedCategory: Category | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoryService: CategoryService
  ) {

    this.createCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]]
    })

    this.updateCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]]
    })

    this.categories = this.categoryService.getCategories();

  }

  ngOnInit() {
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

  addCategory(){
    if(this.createCategoryForm.valid){
      let category: Category = {
        id: this.categories.length + 1,
        ...this.createCategoryForm.value
      }
      this.categoryService.addCategory(category);
      this.categories = this.categoryService.getCategories();
      this.createCategoryForm.reset();
      this.closeModal();
    }
  }

  deleteCategory(category: Category){
    this.categoryService.deleteCategory(category);
    this.categories = this.categoryService.getCategories();
  }

  updateCategory(){
    if(this.updateCategoryForm.valid){
      let updatedCategory: Category = {
        id: this.selectedCategory?.id,
        ...this.updateCategoryForm.value
      }
      this.categoryService.updateCategory(updatedCategory);
      this.categories = this.categoryService.getCategories();
      this.updateCategoryForm.reset({
        name: '',
        description: ''
      });
      this.closeUpdateModal();
    }
  }

  openModal(){
    this.isModalOpen = true;
  }

  openUpdateModal(category: Category){
    this.isUpdateModalOpen = true;
    this.selectedCategory = category;
    this.updateCategoryForm.patchValue({
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
