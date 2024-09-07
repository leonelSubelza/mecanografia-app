import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpmService {
  cpm = signal<number>(0);
  private startTime: number|null = 0;
  characterCount= signal<number>(0);

  constructor() { }

  startCPM(){
    if(!this.startTime){
      this.startTime = Date.now();
    }
  }

  addCharacterCount(){
    this.characterCount.update(value => value + 1);
  }

  finishCPM(){
    const currentTime = Date.now();
    const time = Math.abs(currentTime-(this.startTime||0));
    let elapsedTimeInMinutes = time/(60000)
    elapsedTimeInMinutes = parseFloat(elapsedTimeInMinutes.toFixed(2))

    let totalCPM = 0;   
      
    if (elapsedTimeInMinutes > 0) {
      totalCPM = Math.ceil(this.characterCount() / elapsedTimeInMinutes);
    }
    this.cpm.set(totalCPM);
  }

  resetCPM() {
    this.startTime = null;
    this.characterCount.set(0);
    this.cpm.set(0);
  }
}
