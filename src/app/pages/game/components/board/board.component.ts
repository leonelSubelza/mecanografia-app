import { Component, HostListener, inject } from '@angular/core';
import { Letter, LetterStatus, Word } from '../../../../interfaces/entities';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { WordComponent } from './word/word.component';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { AppStateService } from '../../../../services/app-state.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [WordComponent,MatCardModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  constructor() {}

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this._appStateService.gameOver()) return;

    const { key } = event;
    // console.log(`Key pressed: "${key}"`);   

    if (this._gameHandlerService.isAValidWord(key)) {
      let updateNewLetter: boolean = false;
      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente
      if (this._gameHandlerService.isCorrectLetter(key)) {
        // console.log("la letra es correcta");
        this._appStateService.setActualLetterStatus(LetterStatus.CORRECT);
        
          updateNewLetter = true;
        
      } else {
        this._appStateService.setActualLetterStatus(LetterStatus.INCORRECT);
      }
      if(this._gameHandlerService.isLastLetterInTheGame() && this._appStateService.getActualLetter().status !== LetterStatus.CORRECT){
        return;
      }
      this.moveNextLetter();
      if (updateNewLetter) this._gameHandlerService.updateCorrectLetter();

      this._appStateService.setValueUserWriting(this._appStateService.valueUserWriting()+key);
    }
    if (key === "Backspace") {
      this.movePrevLetter();
      let actualLetter: Letter = this._appStateService.getActualLetter();
      if(actualLetter.status !== LetterStatus.INCORRECT){
        this._gameHandlerService.updateCorrectLetter();
      }

      if(this._appStateService.valueUserWriting().length>0){
        const valueUserWithoutLastCharacter = this._appStateService.valueUserWriting().slice(0, -1);
        this._appStateService.setValueUserWriting(valueUserWithoutLastCharacter);
      }
    }
  }

  movePrevLetter() {
    // if its the first word and the first letter
    if(this._appStateService.indexActualLetter() === 0
    && this._appStateService.indexActualWord() === 0) {
      return;
    }
    this._appStateService.setActualLetterIsActive(false);
    this._appStateService.setActualLetterStatus(LetterStatus.DEFAULT);

    // if its the first letter of the word
    if (this._appStateService.indexActualLetter() === 0) {
      this.setNextWord(false);
      return;
    }
    this.setNextLetter(false);
  }

  moveNextLetter() {
    this._appStateService.setActualLetterIsActive(false);
    let actualWord: Word = this._appStateService.getActualWord();
    //if its the last letter in the word
    if (this._appStateService.indexActualLetter() === actualWord.word.length - 1) {
      //if it is the last word in the game
      if (this._gameHandlerService.isGameCompleted()) {
        this._appStateService.setGameOver(true);
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
    let indexLetterActive = this._appStateService.indexActualLetter();

    if(isNextLetter){
      this._appStateService.setIndexLetterActive(indexLetterActive + 1);
    }else{
      this._appStateService.setIndexLetterActive(indexLetterActive - 1);
    }
    this._appStateService.setActualLetterIsActive(true);
    this._appStateService.setActualLetterStatus(LetterStatus.DEFAULT)
    // this._gameHandlerService.updateActualLetter(this._gameHandlerService.indexLetterActive());
    
  }

  // We know in advance that there is a next or previous letter
  setNextWord(isNextWord: boolean) {
    this._appStateService.setActualWordIsActive(false);

    let actualWordIndex = this._appStateService.indexActualWord();

    if (isNextWord) {
      this._appStateService.setIndexWordActive(actualWordIndex + 1);
      this._appStateService.setIndexLetterActive(0);
    } else {
      this._appStateService.setIndexWordActive(actualWordIndex - 1);
      let newActualWord = this._appStateService.board()[this._appStateService.indexActualWord()];
      this._appStateService.setIndexLetterActive(newActualWord.word.length-1);
    }
    this._appStateService.setActualLetterStatus(LetterStatus.DEFAULT)
    this._appStateService.setActualWordIsActive(true);
    this._appStateService.setActualLetterIsActive(true); 

  }

}
