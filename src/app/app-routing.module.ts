import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => 
      import('./pages/auth/auth.module')
      .then( m => m.AuthPageModule),
    canActivate: [loginGuard],
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'category',
    loadChildren: () => 
      import('./pages/category/category.module')
      .then( m => m.CategoryPageModule),
    canActivate: [IsAuthenticatedGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
