import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameHandlerService {
  text: string = '';
  // letterList: string[] = [];

  wordList: string[] = [];

  private wordSplitSubject = new BehaviorSubject<string[]>([]);
  private gameOverSubject  = new BehaviorSubject<boolean>(false);
  private indexWordActiveSubject = new BehaviorSubject<number>(0);
  private indexLetterActiveSubject = new BehaviorSubject<number>(0);
  
  wordSplit$: Observable<string[]> = this.wordSplitSubject.asObservable();
  gameOver$: Observable<boolean> = this.gameOverSubject.asObservable();
  indexWordActive$ = this.indexWordActiveSubject.asObservable();
  indexLetterActive$ = this.indexLetterActiveSubject.asObservable();


  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   const { key } = event;
  //   // console.log(`Key pressed: "${key}"`);

  //   if (this.juegoTerminado) return;

  //   if (this.isAValidWord(key)) {
  //     console.log('key valida');
  //     // Si la letra activa es igual a la letra pulsada se pasa a la siguiente

  //     let correctLetter = this.wordSplit[this.indexLetterActive];

  //     if (key === correctLetter) {
  //       //if its the last letter in the word
  //       if (this.indexLetterActive === this.wordSplit.length - 1) {
  //         //if it is the last word in the game
  //         if (this.indexWordActive === this.wordList.length - 1) {
  //           this.juegoTerminado = true;
  //           return;
  //         }
  //         //we pass to the next word
  //         this.indexWordActive++;
  //         this.indexLetterActive = 0;
  //         this.wordSplit = this.wordList[this.indexWordActive].split('');
  //         return;
  //       }
  //       this.indexLetterActive++;
  //     }
  //   }
  // }


  isAValidWord(key: string): boolean {
    const regexString: string = `^[a-zA-Z0-9\\s.,;:?!'"()\\-áéíóúÁÉÍÓÚñÑüÜ]$`;
    const regex: RegExp = new RegExp(regexString);
    return regex.test(key) || key === ' ';
  }

  generateBoard() {
    // this.text.split("").forEach(w => {

    // })
    //save all the characters
    // this.letterList = this.text.split('');
    //save all the word including the spaces
    this.wordList = this.text.split(/(\s)/);

    //set the first word
    // this.indexWordActive = 0;
    // this.wordSplit = this.wordList[this.indexWordActiveSubject.getValue()].split('');
    this.setWordSplit(this.wordList[this.indexWordActiveSubject.getValue()].split(''));
  }

  setIndexWordActive(newValue: number) {
    this.indexWordActiveSubject.next(newValue);
  }

  setIndexLetterActive(newValue: number) {
    console.log("se setea nuevo valor para index letter: "+newValue);
    
    this.indexLetterActiveSubject.next(newValue);
  }

  setWordSplit(newValue: string[]){
    this.wordSplitSubject.next(newValue);
  }

  setGameOver(newValue: boolean){
    this.gameOverSubject.next(newValue);
  }
}
