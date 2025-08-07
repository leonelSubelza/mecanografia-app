import { computed, Injectable, signal } from '@angular/core';

const USER_TIME_DEFAULT_VALUE = '00:00:00';
const USER_TIME_DEFAULT_VALUE_COUNTDOWN_VALUE = 30000;

@Injectable({
  providedIn: 'root',
})
export class GameTimerService {
  userTime = signal<string>(USER_TIME_DEFAULT_VALUE);

  private intervalId: number | null = null;
  private startTime: number = 0;

  elapsedTime = signal<number>(0); // en segundos
  formattedTime = computed(() => this.formatTime(this.elapsedTime()));

  direction = signal<'up' | 'down'>('up'); // o 'down'
  countdownDuration = signal<number>(USER_TIME_DEFAULT_VALUE_COUNTDOWN_VALUE); // por ejemplo: 1 minuto (en ms)

  constructor() {}

  private formatTimeUnit(unit: number): string {
    return unit < 10 ? `0${unit}` : `${unit}`; // Asegura que siempre tenga dos dígitos
  }

  // private runTimer() {
  //   const elapsed = performance.now() - this.startTime;

  //   const minutes: number = Math.floor((elapsed / 60000) % 60);
  //   const seconds: number = Math.floor((elapsed / 1000) % 60);
  //   const milliseconds: number = Math.floor((elapsed % 1000) / 10);

  //   const minutesFormated: string = this.formatTimeUnit(minutes);
  //   const secondsFormated: string = this.formatTimeUnit(seconds);
  //   const millisecondsFormated: string = this.formatTimeUnit(milliseconds);
  //   // console.log(`${this.minutes}:${this.seconds}:${this.milliseconds}`);
  //   this.userTime.set(minutesFormated +':'+ secondsFormated+':'+millisecondsFormated);
  //   this.intervalId = requestAnimationFrame(() => this.runTimer());
  // }

  startGameTimer() {
    if (!this.intervalId) {
      this.startTime = performance.now(); // Guarda el tiempo inicial
      this.direction.set('up');
      this.runTimer();
    }
  }

  startCountDownGameTimer(time: number = USER_TIME_DEFAULT_VALUE_COUNTDOWN_VALUE) {
    if (!this.intervalId) {
      this.startTime = performance.now(); // Guarda el tiempo inicial
      this.direction.set('down');
      this.countdownDuration.set(time);
      this.runTimer();
    }
  }

  stopGameTimer() {
    if (this.intervalId !== null) {
      cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
    }
  }

  resetUserTime() {
    this.stopGameTimer();
    this.userTime.set(this.getTimeFormatted(0));
  }

  resetUserTimeCountdown() {
    this.stopGameTimer();
    this.countdownDuration.set(USER_TIME_DEFAULT_VALUE_COUNTDOWN_VALUE);
    this.userTime.set(this.getTimeFormatted(this.countdownDuration()));
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  runTimer(): void {
    const now = performance.now();
    const elapsed = now - this.startTime;

    let displayTime = 0;

    if (this.direction() === 'up') {
      displayTime = elapsed;
    } else {
      displayTime = Math.max(this.countdownDuration() - elapsed, 0);
    }

    this.userTime.set(this.getTimeFormatted(displayTime));

    // Continuar si el contador es ascendente o si en modo regresivo aún queda tiempo
    if (this.direction() === 'up' || displayTime > 0) {
      this.intervalId = requestAnimationFrame(() => this.runTimer());
    } else {
      if (this.intervalId) cancelAnimationFrame(this.intervalId); // detiene el loop cuando llega a 0
    }
  }

  getTimeFormatted(displayedTime: number): string {
    const minutes: number = Math.floor((displayedTime / 60000) % 60);
    const seconds: number = Math.floor((displayedTime / 1000) % 60);
    const milliseconds: number = Math.floor((displayedTime % 1000) / 10);

    const minutesFormatted: string = this.formatTimeUnit(minutes);
    const secondsFormatted: string = this.formatTimeUnit(seconds);
    const millisecondsFormatted: string = this.formatTimeUnit(milliseconds);

    return `${minutesFormatted}:${secondsFormatted}:${millisecondsFormatted}`;
  }

  isTimerCountdownFinished(): boolean {
    return this.userTime() === '00:00:00' && this.direction() === 'down' && this.elapsedTime() === 0;
  }
}
