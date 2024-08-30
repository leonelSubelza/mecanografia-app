import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/game/game.component').then(g => g.GameComponent)
  },
  {
    path: 'user',
    pathMatch: 'full',
    loadComponent: () => import('./pages/user/user.component').then(u => u.UserComponent)
  },
  {
    path: 'stats',
    pathMatch: 'full',
    loadComponent: () => import('./pages/stats/stats.component').then(s => s.StatsComponent)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
