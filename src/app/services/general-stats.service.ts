import { Injectable, signal } from '@angular/core';
import { Stats } from '../interfaces/entities';

@Injectable({
  providedIn: 'root'
})
export class GeneralStatsService {

  myDataSignal = signal<Stats|null>(this.getItem<Stats>('stats'));

  constructor() { }

  getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  setItem(key: string, value: Stats): void {
    localStorage.setItem(key, JSON.stringify(value));
    if(value){
      this.myDataSignal.set(value);
    }
  }
}
