import { Injectable, signal } from '@angular/core';
import { Stats } from '../interfaces/entities';

const DEFAULT_GENERAL_STATE_VALUE: Stats = {
  username: '',
  theme: 'light',
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
  },
};

@Injectable({
  providedIn: 'root',
})
export class GeneralStatsService {
  generalStats = signal<Stats>(DEFAULT_GENERAL_STATE_VALUE);

  constructor() {
    this.generalStats.set(this.getItem('stats'));
  }

  getItem(key: string): Stats {
    const data = localStorage.getItem(key);
    return data === null ? DEFAULT_GENERAL_STATE_VALUE : JSON.parse(data);
  }

  setUsername(value: string) {
    this.generalStats().username = value;
  }

  setStatsLocalStorage(value: Stats): void {
    localStorage.setItem('stats', JSON.stringify(value));
    if (value) {
      this.generalStats.set(value);
    }
  }

  actualGameIsBetter(actualState: Stats): boolean {
    const generalStatsValue = this.generalStats(); // guardamos el valor actual

    if (!actualState.normalMode || !generalStatsValue.normalMode) return false;

    return (
      actualState.normalMode.bestAccuracy >=
      generalStatsValue.normalMode.bestAccuracy
    );
  }
  // private loadInitialStats(): Stats | null {
  //   const storedStats = this.getItem<Stats>('stats');
  //   return storedStats ?? DEFAULT_GENERAL_STATE_VALUE;
  // }
}
