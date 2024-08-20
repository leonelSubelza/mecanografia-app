import { Component, HostListener, inject } from '@angular/core';
import { Letter, LetterStatus, Word } from '../../../../interfaces/entities';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { WordComponent } from './word/word.component';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [WordComponent,MatCardModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  _gameHandlerService = inject(GameHandlerService);

  constructor() {}

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this._gameHandlerService.gameOver()) return;

    const { key } = event;
    // console.log(`Key pressed: "${key}"`);   

    if (this._gameHandlerService.isAValidWord(key)) {
      let updateNewLetter: boolean = false;
      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente
      if (this._gameHandlerService.isCorrectLetter(key)) {
        // console.log("la letra es correcta");
        this._gameHandlerService.setActualLetterStatus(LetterStatus.CORRECT);
        
          updateNewLetter = true;
        
      } else {
        this._gameHandlerService.setActualLetterStatus(LetterStatus.INCORRECT);
      }
      if(this._gameHandlerService.isLastLetterInTheGame() && this._gameHandlerService.getActualLetter().status !== LetterStatus.CORRECT){
        return;
      }
      this.moveNextLetter();
      if (updateNewLetter) this._gameHandlerService.updateCorrectLetter();

      this._gameHandlerService.setValueUserWriting(this._gameHandlerService.valueUserWriting()+key);
    }
    if (key === "Backspace") {
      this.movePrevLetter();
      let actualLetter: Letter = this._gameHandlerService.getActualLetter();
      if(actualLetter.status !== LetterStatus.INCORRECT){
        this._gameHandlerService.updateCorrectLetter();
      }

      if(this._gameHandlerService.valueUserWriting().length>0){
        const valueUserWithoutLastCharacter = this._gameHandlerService.valueUserWriting().slice(0, -1);
        this._gameHandlerService.setValueUserWriting(valueUserWithoutLastCharacter);
      }
    }
  }

  movePrevLetter() {
    // if its the first word and the first letter
    if(this._gameHandlerService.indexActualLetter() === 0
    && this._gameHandlerService.indexActualWord() === 0) {
      return;
    }
    this._gameHandlerService.setActualLetterIsActive(false);
    this._gameHandlerService.setActualLetterStatus(LetterStatus.DEFAULT);

    // if its the first letter of the word
    if (this._gameHandlerService.indexActualLetter() === 0) {
      this.setNextWord(false);
      return;
    }
    this.setNextLetter(false);
  }

  moveNextLetter() {
    this._gameHandlerService.setActualLetterIsActive(false);
    let actualWord: Word = this._gameHandlerService.getActualWord();
    //if its the last letter in the word
    if (this._gameHandlerService.indexActualLetter() === actualWord.word.length - 1) {
      //if it is the last word in the game
      if (this._gameHandlerService.isGameCompleted()) {
        this._gameHandlerService.setGameOver(true);
        return;
      }
      //we pass to the next word
      this.setNextWord(true);
      return;
    }
      //we pass to the next LETTER
    this.setNextLetter(true);
  }

  setNextLetter(isNextLetter: boolean) {
    let indexLetterActive = this._gameHandlerService.indexActualLetter();

    if(isNextLetter){
      this._gameHandlerService.setIndexLetterActive(indexLetterActive + 1);
    }else{
      this._gameHandlerService.setIndexLetterActive(indexLetterActive - 1);
    }
    this._gameHandlerService.setActualLetterIsActive(true);
    this._gameHandlerService.setActualLetterStatus(LetterStatus.DEFAULT)
    // this._gameHandlerService.updateActualLetter(this._gameHandlerService.indexLetterActive());
    
  }

  // We know in advance that there is a next or previous letter
  setNextWord(isNextWord: boolean) {
    this._gameHandlerService.setActualWordIsActive(false);

    let actualWordIndex = this._gameHandlerService.indexActualWord();

    if (isNextWord) {
      this._gameHandlerService.setIndexWordActive(actualWordIndex + 1);
      this._gameHandlerService.setIndexLetterActive(0);
    } else {
      this._gameHandlerService.setIndexWordActive(actualWordIndex - 1);
      let newActualWord = this._gameHandlerService.board()[this._gameHandlerService.indexActualWord()];
      this._gameHandlerService.setIndexLetterActive(newActualWord.word.length-1);
    }
    this._gameHandlerService.setActualLetterStatus(LetterStatus.DEFAULT)
    this._gameHandlerService.setActualWordIsActive(true);
    this._gameHandlerService.setActualLetterIsActive(true); 

  }

}
