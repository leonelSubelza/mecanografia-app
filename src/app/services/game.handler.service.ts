import { Injectable, signal } from '@angular/core';
import { Letter, LetterStatus, TextContent, Word } from '../interfaces/entities';
import { texts } from '../shared/mock/texts.mock';

@Injectable({
  providedIn: 'root',
})
export class GameHandlerService {
  gameOver = signal<boolean>(false);
  indexWordActive = signal<number>(0);
  indexLetterActive = signal<number>(0);
  textContent = signal<TextContent>(texts[0]);
  board = signal<Word[]>([]);

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

  getCorrectLetter(): Letter {
    const actualWord: Word = this.board()[this.indexWordActive()];
    return actualWord.letterList[this.indexLetterActive()];
  }

  generateBoard(newText: string) {
    //save all the word including the spaces
    const wordsList: string[] = this.getWordsWithSpaces(newText);
    
    wordsList.forEach( (word: string) => {
      const newWord: Word = this.generateWord(word);
      this.board().push(newWord)
    })
  }

    // esto cambiarlo
  areAllLettersCorrect(): boolean {
    let allLettersAreCorrect: boolean = true;
    this.board().forEach( (word: Word) => {
      const letterCorrect = word.letterList.find( (letter: Letter) => letter.status === LetterStatus.CORRECT);
      allLettersAreCorrect = allLettersAreCorrect && letterCorrect!==undefined;
    })
    return allLettersAreCorrect;
  }

  isGameCompleted(): boolean {
    return this.indexWordActive() === this.board().length - 1
    // && this.areAllLettersCorrect();
  }

  setLetterActiveStatus = (status: LetterStatus) => {
    this.board()[this.indexWordActive()].letterList[this.indexLetterActive()].status = status;
  }

  setIndexWordActive(newValue: number) {
    this.indexWordActive.set(newValue);
  }

  setIndexLetterActive(newValue: number) {
    this.indexLetterActive.set(newValue);
  }

  // setWordSplit(newValue: Word[]) {
  //   this.wordSplit.set(newValue);
  // }
  setTextContent(textContent: TextContent) {
    this.textContent.set(textContent);
  }

  setGameOver(newValue: boolean) {
    this.gameOver.set(newValue);
  }

  setActualLetterActive(status: boolean) {
    let actualWord: Word = this.board()[this.indexWordActive()];
    let actualLetter: Letter = actualWord.letterList[this.indexLetterActive()];
    actualLetter.isActive = status;
  }

  setActualWordActive(status: boolean) {
    let actualWord: Word = this.board()[this.indexWordActive()];
    actualWord.isActive = status;
  }

  getActualWord(): Word{
    return this.board()[this.indexWordActive()];
  }

  getActualLetter(): Letter {
    return this.board()[this.indexWordActive()].letterList[this.indexLetterActive()]
  }
}
