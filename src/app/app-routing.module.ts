import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'todo', loadChildren: () => import('./todo/todo.module').then(m => m.TodoPageModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormPageModule) },
  //for editing an existing task
  { path: 'form/:id', loadChildren: () => import('./form/form.module').then(m => m.FormPageModule) },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
