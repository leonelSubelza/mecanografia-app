import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { TextGenerationAPIService } from '../../services/text-generation-api.service';
import { Router } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { WordComponent } from './word/word.component';
import { GameHandlerService } from '../../services/game.handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgClass, WordComponent, NgFor],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {

  private _gameHandlerService = inject(GameHandlerService);
  private _apiService = inject(TextGenerationAPIService);
  private _router = inject(Router);

  // private subscription?: Subscription;
  private subscriptions = new Subscription();

  wordList: string[] = [];
  wordSplit: string[] = [];
  indexWordActive: number = 0;;
  indexLetterActive: number = 0;
  gameOver?: boolean;

  ngOnInit(): void {
    this.setRandomWord();
    // this.gameOver = this._gameHandlerService.gameOver$;
    this.wordList = this._gameHandlerService.wordList;

    this.subscriptions.add(
      this._gameHandlerService.wordSplit$.subscribe(value => {
        this.wordSplit = value;
      })
    );

    this.subscriptions.add(
      this._gameHandlerService.indexWordActive$.subscribe(index => {
        this.indexWordActive = index;
      })
    );
   
    this.subscriptions.add(
      this._gameHandlerService.indexLetterActive$.subscribe(index => {
        this.indexLetterActive = index;
      })
    );
    

    this.subscriptions.add(
      this._gameHandlerService.gameOver$.subscribe(value => {
        this.gameOver = value;
      })
    );

    // this.indexWordActive = this._gameHandlerService.indexWordActive;
    // this.subscription = this._gameHandlerService.indexWordActive$.subscribe(index => {
    //   this.indexWordActive = index;
    // });

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const { key } = event;
    // console.log(`Key pressed: "${key}"`);
    
    if (this.gameOver) return;

    if (this._gameHandlerService.isAValidWord(key)) {
      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente

      let correctLetter: string = this.wordSplit[this.indexLetterActive];

      // console.log("letra correcta: "+correctLetter);

      if (key === correctLetter) {
        // console.log("la letra es correcta");
        
        //if its the last letter in the word
        if (this.indexLetterActive === this.wordSplit.length - 1) {
          // console.log("if its the last letter in the word");
          
          //if it is the last word in the game
          if (this.indexWordActive === this.wordList.length - 1) {
            // console.log("is the last word, we pass to the next");
            
            this._gameHandlerService.setGameOver(true)
            return;
          }
          //we pass to the next word
          // this.indexWordActive++;
          this._gameHandlerService.setIndexWordActive(this.indexWordActive+1);
          // this.indexLetterActive = 0;
          this._gameHandlerService.setIndexLetterActive(0);
          this._gameHandlerService.setWordSplit(this.wordList[this.indexWordActive].split(''));
          return;
        }
        // console.log("we pass to the next letter");
        
        this._gameHandlerService.setIndexLetterActive(this.indexLetterActive+1);
        // console.log("indexLetterActive: "+this.indexLetterActive);
        // console.log("indexWordActive: "+this.indexWordActive);
        
        
      }
    }
  }


  setRandomWord() {
    // this._apiService.getRandomWord(1, 5).subscribe((data: any) => {
    //   console.log(data);
    //   this.text=data.text;
    // });
    this._gameHandlerService.text =
      'Red Dead Redemption 2 es un videojuego de acción-aventura de mundo abierto desarrollado y publicado por Rockstar Games. El juego es la tercera entrada de la serie Red Dead y una precuela del juego de 2010 Red Dead Redemption.';
    this._gameHandlerService.generateBoard();
  }

  ngOnDestroy() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    this.subscriptions.unsubscribe();
  }
}
