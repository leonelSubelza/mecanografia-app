import { inject, Injectable, signal } from '@angular/core';
import { Letter, LetterStatus, TextContent, Word } from '../interfaces/entities';
import { texts } from '../shared/mock/texts.mock';
import { AppStateService } from './app-state.service';
import { GameTimerService } from './game-timer.service';
import { ModalService } from '../pages/game/components/modal/modal.service';
import { ModalComponent } from '../pages/game/components/modal/modal.component';


@Injectable({
  providedIn: 'root',
})
export class GameHandlerService {
  private _appStateService = inject(AppStateService);
  private _gameTimerService = inject(GameTimerService);
  private _modalService = inject(ModalService);

  isAValidWord(key: string): boolean {
    const regexString: string = `^[a-zA-Z0-9\\s.,;:?!'"()\\-áéíóúÁÉÍÓÚñÑüÜ]$`;
    const regex: RegExp = new RegExp(regexString);
    return regex.test(key) || key === ' ';
  }

  private getWordsWithSpaces(texto: string): string[] {
    const regex = /[^\s]+[\s,.?!]*/g;
    const matches = texto.match(regex);
    return matches ? matches : [];
  }

  private generateLetterList = (word: string): Letter[] => {
    let letterList: Letter[] = [];
    word.split('').forEach((letter: string) => {
      letterList.push({
        letter: letter,
        isActive: false,
        status: LetterStatus.DEFAULT,
      });
    });
    return letterList;
  };

  private generateWord = (word: string): Word => {
    return {
      word: word,
      letterList: this.generateLetterList(word),
      indexLetterActive: 0,
      isActive: false,
    };
  };

  generateBoard(newText: string) {
    //save all the word including the spaces
    const wordsList: string[] = this.getWordsWithSpaces(newText);

    wordsList.forEach((word: string) => {
      const newWord: Word = this.generateWord(word);
      this._appStateService.board().push(newWord);
    });
  }

  // esto cambiarlo
  areAllLettersCorrect(): boolean {
    let allLettersAreCorrect: boolean = true;
    this._appStateService.board().forEach((word: Word) => {
      const letterCorrect = word.letterList.find(
        (letter: Letter) => letter.status === LetterStatus.CORRECT
      );
      allLettersAreCorrect =
        allLettersAreCorrect && letterCorrect !== undefined;
    });
    return allLettersAreCorrect;
  }

  isGameCompleted(): boolean {
    let actualLetter: Letter = this._appStateService.getActualLetter();
    return (
      this._appStateService.indexActualWord() ===
        this._appStateService.board().length - 1 &&
      actualLetter.status === LetterStatus.CORRECT
    );
  }

  isLastLetterInTheGame(): boolean {
    let actualWord: Word = this._appStateService.getActualWord();
    return (
      this._appStateService.indexActualWord() ===
        this._appStateService.board().length - 1 &&
      this._appStateService.indexActualLetter() ===
        actualWord.letterList.length - 1
    );
  }

  updateCorrectLetter() {
    const correctLetter =
      this._appStateService.board()[this._appStateService.indexActualWord()]
        .letterList[this._appStateService.indexActualLetter()];
    this._appStateService.setCorrectLetter(correctLetter);
    this._appStateService.setIndexCorrectLetter(
      this._appStateService.indexActualLetter()
    );
    this._appStateService.setIndexCorrectWord(
      this._appStateService.indexActualWord()
    );
  }

  isCorrectLetter(letter: string) {
    return (
      letter === this._appStateService.correctLetter().letter &&
      this._appStateService.indexActualWord() ===
        this._appStateService.indexCorrectWord() &&
      this._appStateService.indexActualLetter() ===
        this._appStateService.indexCorrectLetter()
    );
  }

  /*
  restartGame() {
    
  }

  finishGame() {
    this._gameTimerService.stopGameTimer();
    this._modalService.openModal<ModalComponent>(ModalComponent);
  }

  startNewGame() {
    this._appStateService.setGameOver(false);
    this._gameTimerService.resetUserTime();
    this.setRandomWord();
    this._appStateService.setActualLetterIsActive(true);
    this._appStateService.setIndexWordActive(0);
    this._appStateService.setIndexLetterActive(0);
    this._appStateService.setActualWordIsActive(true);
    this.updateCorrectLetter()
  }

  setRandomWord() {
    const indexRandomText: number = Math.floor(Math.random() * texts.length);
    const randomText: TextContent = texts[indexRandomText];

    this.generateBoard(randomText.text);
    // this._gameHandlerService.generateBoard('aaaaaa bbbbb aaa');
    this._appStateService.setTextContent(randomText);

    this._appStateService.setIndexWordActive(0);
    this._appStateService.setIndexLetterActive(0);
  }
*/

  resetAllValues() {
    this._appStateService.setGameOver(false);
    this._gameTimerService.resetUserTime();
    this._appStateService.board.set([]);
    this._appStateService.setGamePercentCompleted(0);
    this._appStateService.setValueUserWriting('');
  }

  restartGame() {
    this.resetAllValues();
    this.setStartValues(this._appStateService.textContent());
  }

  finishGame() {
    this._gameTimerService.stopGameTimer();
    this._modalService.openModal<ModalComponent>(ModalComponent);
  }

  startNewGame() {
    this.resetAllValues();
    this.setRandomContent();
  }

  setRandomContent() {
    const randomContent = this.getRandomContent();
    this.setStartValues(randomContent);
  }

  getRandomContent(): TextContent {
    const indexRandomText: number = Math.floor(Math.random() * texts.length);
    return texts[indexRandomText];
  }

  setStartValues(randomContent: TextContent) {
    this._appStateService.setTextContent(randomContent);

    // this.generateBoard(randomContent.text);
    this.generateBoard('aaaaaa bbbbb ccc');

    this._appStateService.setIndexWordActive(0);
    this._appStateService.setIndexLetterActive(0);
    this._appStateService.setActualLetterIsActive(true);
    this._appStateService.setActualWordIsActive(true);
    this._appStateService.setIndexCorrectWord(0);
    this.updateCorrectLetter();
  }
}
