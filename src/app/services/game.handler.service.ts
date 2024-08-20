import { inject, Injectable, signal } from '@angular/core';
import { Letter, LetterStatus, TextContent, Word } from '../interfaces/entities';
import { texts } from '../shared/mock/texts.mock';
import { AppStateService } from './app-state.service';


@Injectable({
  providedIn: 'root',
})
export class GameHandlerService {

  private _appStateService = inject(AppStateService);

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
    word.split('').forEach( (letter: string) => {
      letterList.push({
        letter: letter,
        isActive: false,
        status: LetterStatus.DEFAULT
      })
    })
    return letterList;
  }

  private generateWord = (word: string): Word => {
    return {
      word: word,
      letterList: this.generateLetterList(word),
      indexLetterActive: 0,
      isActive: false
    }
  }

  generateBoard(newText: string) {
    //save all the word including the spaces
    const wordsList: string[] = this.getWordsWithSpaces(newText);
    
    wordsList.forEach( (word: string) => {
      const newWord: Word = this.generateWord(word);
      this._appStateService.board().push(newWord)
    })
  }

    // esto cambiarlo
  areAllLettersCorrect(): boolean {
    let allLettersAreCorrect: boolean = true;
    this._appStateService.board().forEach( (word: Word) => {
      const letterCorrect = word.letterList.find( (letter: Letter) => letter.status === LetterStatus.CORRECT);
      allLettersAreCorrect = allLettersAreCorrect && letterCorrect!==undefined;
    })
    return allLettersAreCorrect;
  }

  isGameCompleted(): boolean {
    let actualLetter: Letter = this._appStateService.getActualLetter();
    return this._appStateService.indexActualWord() === this._appStateService.board().length - 1
    && actualLetter.status === LetterStatus.CORRECT;
  }
  
  isLastLetterInTheGame(): boolean {
    let actualWord: Word = this._appStateService.getActualWord();
    return this._appStateService.indexActualWord() === this._appStateService.board().length-1
    && this._appStateService.indexActualLetter() === actualWord.letterList.length-1;
  }

  updateCorrectLetter() {
    const correctLetter = this._appStateService.board()[this._appStateService.indexActualWord()].letterList[this._appStateService.indexActualLetter()];
    this._appStateService.setCorrectLetter(correctLetter);
    this._appStateService.setIndexCorrectLetter(this._appStateService.indexActualLetter());
    this._appStateService.setIndexCorrectWord(this._appStateService.indexActualWord());
  }

  isCorrectLetter(letter: string) {
    return letter === this._appStateService.correctLetter().letter
    && this._appStateService.indexActualWord() === this._appStateService.indexCorrectWord()
    && this._appStateService.indexActualLetter() === this._appStateService.indexCorrectLetter()
  }

}
