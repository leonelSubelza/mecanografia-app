import { inject, Injectable, signal } from '@angular/core';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserAccuracyService {
  private _appStateService = inject(AppStateService);

  totalLettersCorrect = signal<number>(0);
  totalLettersWritten = signal<number>(0);

  constructor() { }

  updateUserAccuracy(){
    let totalCorrect: number = Math.floor((this.totalLettersCorrect()*100)/this.totalLettersWritten());
    this._appStateService.setUserAccuracy(totalCorrect);
  }

  resetValues(){
    this.totalLettersCorrect.set(0);
    this.totalLettersWritten.set(0);
    this._appStateService.setUserAccuracy(100);
  }

  addOneCorrectLetter(){
    this.totalLettersCorrect.set(this.totalLettersCorrect()+1);
    this.updateUserAccuracy();
  }

  addOneTotalLettersWritten(){
    this.totalLettersWritten.set(this.totalLettersWritten()+1);
    this.updateUserAccuracy();
  }
}
