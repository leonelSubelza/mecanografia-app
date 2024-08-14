import { Component, HostListener, OnInit, inject } from '@angular/core';
import { GameHandlerService } from '../../services/game.handler.service';
import { WordComponent } from '../../shared/word/word.component';
import { Letter, LetterStatus, TextContent, Word } from '../../interfaces/entities';
import { texts } from '../../shared/mock/texts.mock';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [WordComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  _gameHandlerService = inject(GameHandlerService);

  constructor() {}

  ngOnInit(): void {
    this.startNewGame();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this._gameHandlerService.gameOver()) return;

    const { key } = event;
    console.log(`Key pressed: "${key}"`);

    if (this._gameHandlerService.isAValidWord(key)) {
      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente
      let correctLetter: Letter = this._gameHandlerService.getCorrectLetter();
      // console.log("letra correcta: "+correctLetter);

      if (key === correctLetter.letter) {
        // console.log("la letra es correcta");
        this._gameHandlerService.setLetterActiveStatus(LetterStatus.CORRECT);
      } else {
        this._gameHandlerService.setLetterActiveStatus(LetterStatus.INCORRECT);
      }

      this.moveNextLetter();
    }
    if (key === "Backspace") {
      this.movePrevLetter();
      return;
    }
  }

  movePrevLetter() {
    this._gameHandlerService.setActualLetterActive(false);
    let actualLetter: Letter = this._gameHandlerService.getActualLetter()
    actualLetter.status = LetterStatus.DEFAULT;
    if (this._gameHandlerService.indexLetterActive() === 0) {
      if(this._gameHandlerService.indexWordActive()===0){
        return;
      }
      this.setNextWord(false);
      return;
    }
    this.setNextLetter(false);
  }

  moveNextLetter() {
    this._gameHandlerService.setActualLetterActive(false);
    let actualWord: Word = this._gameHandlerService.board()[this._gameHandlerService.indexWordActive()];
    //if its the last letter in the word
    if (this._gameHandlerService.indexLetterActive() === actualWord.word.length - 1) {
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
    let indexLetterActive = this._gameHandlerService.indexLetterActive();

    if(isNextLetter){
      this._gameHandlerService.setIndexLetterActive(indexLetterActive + 1);
    }else{
      this._gameHandlerService.setIndexLetterActive(indexLetterActive - 1);
    }
    const actualLetter: Letter = this._gameHandlerService.getActualLetter();
    actualLetter.status = LetterStatus.DEFAULT
  }

  // We know in advance that there is a next or previous letter
  setNextWord(isNextWord: boolean) {
    this._gameHandlerService.setActualWordActive(false);

    let actualWordIndex = this._gameHandlerService.indexWordActive();

    if (isNextWord) {
      this._gameHandlerService.setIndexWordActive(actualWordIndex + 1);
      this._gameHandlerService.setIndexLetterActive(0);
    } else {
      this._gameHandlerService.setIndexWordActive(actualWordIndex - 1);
      let actualWord = this._gameHandlerService.getActualWord();
      this._gameHandlerService.setIndexLetterActive(actualWord.word.length-1);
    }
    
    this._gameHandlerService.setActualWordActive(true);
    this._gameHandlerService.setActualLetterActive(true);
    const actualLetter: Letter = this._gameHandlerService.getActualLetter();
    actualLetter.status = LetterStatus.DEFAULT
  }

  startNewGame() {
    this.setRandomWord();
    this._gameHandlerService.setIndexWordActive(0);
    this._gameHandlerService.setIndexLetterActive(0);
    this._gameHandlerService.setActualWordActive(true);
    this._gameHandlerService.setActualLetterActive(true);
  }

  setRandomWord() {
    const indexRandomText: number = Math.floor(Math.random() * texts.length);
    const randomText: TextContent = texts[indexRandomText];

    this._gameHandlerService.generateBoard(randomText.text);
    this._gameHandlerService.setTextContent(randomText);
  }
}
