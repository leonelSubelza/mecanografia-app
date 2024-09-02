import { Routes } from '@angular/router';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    // component carga la pagina si o si
    component: GameComponent
  },
  {
    path: 'user',
    pathMatch: 'full',
    // loadComponent hablita el lazy loading y solo carga la pagina si es necesario
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
