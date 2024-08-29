import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/game/game.component').then(g => g.GameComponent)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
