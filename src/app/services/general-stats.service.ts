import { inject, Injectable, signal } from '@angular/core';
import { GameMode, Stats } from '../interfaces/entities';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const DEFAULT_GENERAL_STATE_VALUE: Stats = {
  username: '',
  theme: 'light',
  sound: true,
  normalMode: {
    bestTextContent: {
      title: '-',
      text: '-',
      letterCount: 0,
    },
    bestTime: '00:00:00',
    bestAccuracy: 0,
    cpm: 0,
  },
  sprintMode: {
    bestScore: 0,
    totalWordsWritten: 0,
    cpm: 0,
  },
};

@Injectable({
  providedIn: 'root',
})
export class GeneralStatsService {
  generalStats = signal<Stats>(DEFAULT_GENERAL_STATE_VALUE);
  gameMode = signal<GameMode>(GameMode.PRECISION_MODE);
  _router = inject(Router);

  constructor() {
    this.generalStats.set(this.getItem('stats'));
    
    // cada vez que se cambie de url se actualiza el gameMode
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        switch (event.urlAfterRedirects) {
          case '/':
            this.gameMode.set(GameMode.PRECISION_MODE);
            break;
          case '/sprint-mode':
            this.gameMode.set(GameMode.SPRINT_MODE);
            break;
          default:
            this.gameMode.set(GameMode.PRECISION_MODE);
        }
      });
  }

  getItem(key: string): Stats {
    const data = localStorage.getItem(key);
    return data === null ? DEFAULT_GENERAL_STATE_VALUE : JSON.parse(data);
  }

  setStats(value: Stats): void {
    localStorage.setItem('stats', JSON.stringify(value));
    if (value) {
      this.generalStats.set(value);
    }
  }

  actualGameIsBetter(actualState: any): boolean {
    const generalStatsValue = this.generalStats(); // guardamos el valor actual

    if (!generalStatsValue.normalMode) return false;
    return (
      actualState.bestAccuracy >=
      generalStatsValue.normalMode.bestAccuracy
    );
  }

  setFavicon(isLightMode: boolean) {
    let iconPath: string = 'images/keyboard-light.svg';
    if(isLightMode) {
      iconPath = 'images/keyboard-dark.svg';
    }
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconPath;
  }
}
