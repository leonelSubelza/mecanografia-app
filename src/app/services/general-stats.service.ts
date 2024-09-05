import { Injectable, signal } from '@angular/core';
import { Stats } from '../interfaces/entities';

const DEFAULT_GENERAL_STATE_VALUE: Stats = {
  username: '',
  bestTextContent: {
    title: '-',
    text: '-',
    letterCount: 0
  },
  bestTime: '00:00:00',
  bestAccuracy: 0,
  cpm: 0
}

@Injectable({
  providedIn: 'root'
})
export class GeneralStatsService {

  generalStats = signal<Stats>(this.getItem('stats'));
  // private document: Document = inject<Document>(DOCUMENT);

  constructor() { }

  getItem(key: string): Stats {
      const data = localStorage.getItem(key);
      return data===null ? DEFAULT_GENERAL_STATE_VALUE : JSON.parse(data);
    // return data ? JSON.parse(data) as T : null;
  }

  setUsername(value: string){
    this.generalStats().username = value;
  }

  setStatsLocalStorage(value: Stats): void {
      localStorage.setItem('stats', JSON.stringify(value));
      if(value){
        this.generalStats.set(value);
      }
  }

  actualGameIsBetter(actualState: Stats): boolean {
    if(actualState.bestAccuracy>=this.generalStats().bestAccuracy){
      return true;
    }
    return false
  }
  // private loadInitialStats(): Stats | null {
  //   const storedStats = this.getItem<Stats>('stats');
  //   return storedStats ?? DEFAULT_GENERAL_STATE_VALUE;
  // }
}
