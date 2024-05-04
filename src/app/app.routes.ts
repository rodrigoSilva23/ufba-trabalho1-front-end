import { Routes } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { EnderecoComponent } from './components/pages/endereco/endereco.component';
import { authGuard } from './auth.guard';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { AuthComponent } from './components/pages/auth/auth.component';
import { LayoutComponent } from './components/pages/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
   component: AuthComponent,title: 'login',
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],

    children: [
      {
        path: 'home',
        component: HomeComponent,
      },

      {
        path: 'endereco',
        component: EnderecoComponent,
      },
  

    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
   title: 'Pagina não encontrada',
  },
];
