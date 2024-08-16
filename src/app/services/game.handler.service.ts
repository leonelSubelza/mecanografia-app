import { Injectable, signal } from '@angular/core';
import { Letter, LetterStatus, TextContent, Word } from '../interfaces/entities';
import { texts } from '../shared/mock/texts.mock';

const CORRECT_LETTER_DEFAULT_VALUE = {
  letter: '',
  isActive: false,
  status: LetterStatus.DEFAULT
}

const ACTUAL_WORD_DEFAULT_VALUE = {
  word: '',
  letterList: [],
  indexLetterActive: 0,
  isActive: false
}

@Injectable({
  providedIn: 'root',
})
export class GameHandlerService {
  board = signal<Word[]>([]);
  gameOver = signal<boolean>(false);
  textContent = signal<TextContent>(texts[0]);

  indexActualWord = signal<number>(0);
  indexActualLetter = signal<number>(0);
  // actualWord = signal<Word>(ACTUAL_WORD_DEFAULT_VALUE);
  // actualLetter = signal<Letter>(CORRECT_LETTER_DEFAULT_VALUE);

  indexCorrectWord = signal<number>(0);
  indexCorrectLetter = signal<number>(0);
  correctLetter = signal<Letter>(CORRECT_LETTER_DEFAULT_VALUE);

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
    let actualLetter: Letter = this.getActualLetter();
    return this.indexActualWord() === this.board().length - 1
    && actualLetter.status === LetterStatus.CORRECT;
  }
  
  isLastLetterInTheGame(): boolean {
    let actualWord: Word = this.getActualWord();
    return this.indexActualWord() === this.board().length-1
    && this.indexActualLetter() === actualWord.letterList.length-1;
  }

  setActualLetterStatus = (status: LetterStatus) => {
    this.board()[this.indexActualWord()].letterList[this.indexActualLetter()].status = status;
  }

  setIndexWordActive(newValue: number) {
    this.indexActualWord.set(newValue);
  }

  setIndexLetterActive(newValue: number) {
    this.indexActualLetter.set(newValue);
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


  getActualWord(): Word {
    return this.board()[this.indexActualWord()];
  }

  getActualLetter(): Letter {
    return this.board()[this.indexActualWord()].letterList[this.indexActualLetter()];
  }

  setActualLetterIsActive(status: boolean) {
    this.board()[this.indexActualWord()].letterList[this.indexActualLetter()].isActive = status;
  }

  setActualWordIsActive(status: boolean) {
    this.board()[this.indexActualWord()].letterList[this.indexActualLetter()].isActive = status;
  }

  updateCorrectLetter() {
    const correctLetter = this.board()[this.indexActualWord()].letterList[this.indexActualLetter()];
    this.correctLetter.set(correctLetter);
    this.indexCorrectLetter.set(this.indexActualLetter());
    this.indexCorrectWord.set(this.indexActualWord());
    console.log("new correct letter:");
    console.log(correctLetter);
    
    
  }

  isCorrectLetter(letter: string) {
    return letter === this.correctLetter().letter
    && this.indexActualWord() === this.indexCorrectWord()
    && this.indexActualLetter() === this.indexCorrectLetter()
  }
}
