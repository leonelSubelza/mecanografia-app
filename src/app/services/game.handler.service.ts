import { inject, Injectable } from '@angular/core';
import { Letter, LetterStatus, TextContent, Word } from '../interfaces/entities';
import { texts } from '../shared/mock/texts.mock';
import { AppStateService } from './app-state.service';
import { GameTimerService } from './game-timer.service';
import { ModalService } from '../pages/game/components/modal/modal.service';
import { UserAccuracyService } from './user-accuracy.service';
import { generateWord } from '../pages/game/utils/entity-generator';
import { CpmService } from './cpm.service';


@Injectable({
  providedIn: 'root',
})
export class GameHandlerService {
  private _appStateService = inject(AppStateService);
  private _gameTimerService = inject(GameTimerService);
  private _userAccuracyService = inject(UserAccuracyService);
  private _cpmService = inject(CpmService);

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

  generateBoard(newText: string) {
    //save all the word including the spaces
    const wordsList: string[] = this.getWordsWithSpaces(newText);

    wordsList.forEach((word: string,index: number) => {
      const newWord: Word = generateWord(word,index);
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
      this._appStateService.board()[this._appStateService.indexActualWord()].letterList[this._appStateService.indexActualLetter()];

    this._appStateService.setCorrectLetter(correctLetter);
    this._appStateService.setIndexCorrectLetter(
      this._appStateService.indexActualLetter()
    );
    this._appStateService.setIndexCorrectWord(
      this._appStateService.indexActualWord()
    );   
  }

  isWordCompleted(): boolean{
    let actualWord: Word = this._appStateService.getActualWord();
    return actualWord.letterList.find( (letter: Letter) => letter.status !== LetterStatus.CORRECT) === undefined;
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

  getPrevLetter(): Letter{
    let indexActualLetter = this._appStateService.indexActualLetter();
    let indexActualWord = this._appStateService.indexActualWord();
    if(indexActualLetter===0){
      let prevWord: Word = this._appStateService.board()[indexActualWord-1];
      return prevWord.letterList[prevWord.letterList.length-1];
    }else{
      return this._appStateService.board()[indexActualWord].letterList[indexActualLetter-1];
    }
  }

  resetAllValues() {
    this._appStateService.setGameOver(false);
    this._appStateService.board.set([]);
    this._appStateService.setGamePercentCompleted(0);
    this._appStateService.setValueUserWriting('');
    this._gameTimerService.resetUserTime();
    this._userAccuracyService.resetValues();
    this._cpmService.resetCPM();
  }

  restartGame() {
    this.resetAllValues();
    this.setStartValues(this._appStateService.textContent());
  }

  finishGame() {
    this._gameTimerService.stopGameTimer();
    this._cpmService.finishCPM()
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

    this.generateBoard(randomContent.text);
    // this.generateBoard('auto bbbbb ccc');

    this._appStateService.setIndexWordActive(0);
    this._appStateService.setIndexLetterActive(0);
    this._appStateService.setActualLetterIsActive(true);
    this._appStateService.setActualWordIsActive(true);
    this._appStateService.setIndexCorrectWord(0);
    this.updateCorrectLetter();
  }
}
