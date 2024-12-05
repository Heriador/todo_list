import { Injectable } from '@angular/core';
import { Category } from 'src/app/interfaces/category.interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = JSON.parse(localStorage.getItem("categories") || '[]').length > 0 
  ? JSON.parse(localStorage.getItem("categories") || '[]') : [
    {id: 1, name: 'trabajo', description: "wast"},
    {id: 2, name: 'personal', description: "wast"},
  ];

  constructor() { }

  getCategories(){
    return this.categories;
  }

 
  getCategoryById(id: number){
    return this.categories.find(category => category.id === id);
  }

  addCategory(category: Category){
    this.categories.push(category);
    localStorage.setItem("categories", JSON.stringify(this.categories));
  }

  updateCategory(category: Category){
    const index = this.categories.findIndex(c => c.id === category.id);
    this.categories[index] = category;
  }

  deleteCategory(category: Category){
    const index = this.categories.indexOf(category);
    this.categories.splice(index, 1);
    localStorage.setItem("categories", JSON.stringify(this.categories));
  }
}
