import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module')
      .then(m => m.HomeModule),
  },
  {
    path: 'create-user',
    loadChildren: () => import('./create-edit-user/create-edit-user.module')
      .then(m => m.CreateEditUserModule),
  },
  {
    path: 'edit-user',
    loadChildren: () => import('./create-edit-user/create-edit-user.module')
      .then(m => m.CreateEditUserModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
