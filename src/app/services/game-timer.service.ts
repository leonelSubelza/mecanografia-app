import { inject, Injectable, signal } from '@angular/core';
import { AppStateService } from './app-state.service';

const USER_TIME_DEFAULT_VALUE = '00:00:00'

@Injectable({
  providedIn: 'root',
})
export class GameTimerService {
  _appStateService = inject(AppStateService);

  userTime = signal<string>(USER_TIME_DEFAULT_VALUE);

  private intervalId: number| null = null;
  private startTime: number = 0;

  constructor() {}

  private formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`; // Asegura que siempre tenga dos dígitos
  }

  private runTimer() {
    const elapsed = performance.now() - this.startTime;

    const minutes: number = Math.floor((elapsed / 60000) % 60);
    const seconds: number = Math.floor((elapsed / 1000) % 60);
    const milliseconds: number = Math.floor((elapsed % 1000) / 10);
  
    const minutesFormated: string = this.formatTimeUnit(minutes);
    const secondsFormated: string = this.formatTimeUnit(seconds);
    const millisecondsFormated: string = this.formatTimeUnit(milliseconds);
    // console.log(`${this.minutes}:${this.seconds}:${this.milliseconds}`);
    this.userTime.set(minutesFormated +':'+ secondsFormated+':'+millisecondsFormated);
    this.intervalId = requestAnimationFrame(() => this.runTimer());
  }

  startGameTimer() {
    if(!this.intervalId){
      this.startTime = performance.now(); // Guarda el tiempo inicial
      this.runTimer();
    }
  }

  stopGameTimer() {
    if (this.intervalId !== null) {
      cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
    }
  }

  resetUserTime(){
    this.stopGameTimer();
    this.userTime.set(USER_TIME_DEFAULT_VALUE);
  }
}
