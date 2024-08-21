import { inject, Injectable, signal } from '@angular/core';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameTimerService {
  _appStateService = inject(AppStateService);

  userTime = signal<string>('00:00:00');

  // private milliseconds: number = 0;
  // private seconds: number = 0;
  // private minutes: number = 0;

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
    // if (!this.intervalId) {
    //   this.intervalId = setInterval(()=>{
    //     this.milliseconds++;
    //     if (this.milliseconds === 60) {
    //       this.milliseconds=0;
    //       this.seconds++;
    //       if (this.seconds === 60) {
    //         this.seconds=0;
    //         this.minutes++;
    //         if(this.minutes===60){
    //           this.minutes=0;
    //         }
    //       }
    //     }
    //     this.userTime.set(this.minutes +':'+ this.seconds+':'+this.milliseconds);
    //   },18);
    // }
    if(!this.intervalId){
      this.startTime = performance.now(); // Guarda el tiempo inicial
      this.runTimer();
    }
  }

  stopGameTimer() {
    // clearInterval(this.intervalId);
    // release our intervalID from the variable
    // this.intervalId = undefined;

    if (this.intervalId !== null) {
      cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
    }
  }

  // resetGameTimer() {
  //   this.milliseconds = 0;
  //   this.seconds = 0;
  //   this.minutes = 0;
  // }
}
