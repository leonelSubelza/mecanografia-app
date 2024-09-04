import { Injectable, signal } from '@angular/core';
import { Letter, LetterStatus, TextContent, Word } from '../interfaces/entities';
import { texts } from '../shared/mock/texts.mock';


const CORRECT_LETTER_DEFAULT_VALUE = {
  id: '00',
  letter: '',
  index: 0,
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
  providedIn: 'root'
})
export class AppStateService {
  board = signal<Word[]>([]);
  gameOver = signal<boolean>(false);
  textContent = signal<TextContent>(texts[0]);
  isSoundActive = signal<boolean>(true);
  indexActualWord = signal<number>(0);
  indexActualLetter = signal<number>(0);

  indexCorrectWord = signal<number>(0);
  indexCorrectLetter = signal<number>(0);
  correctLetter = signal<Letter>(CORRECT_LETTER_DEFAULT_VALUE);

  valueUserWriting = signal<string>('');

  userTime = signal<string>('');

  userAccuracy = signal<number>(100);

  gamePercentCompleted = signal<number>(0);



  constructor() { }

  getActualWord(): Word {
    return this.board()[this.indexActualWord()];
  }

  getActualLetter(): Letter {
    return this.board()[this.indexActualWord()].letterList[this.indexActualLetter()];
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

  setTextContent(textContent: TextContent) {
    this.textContent.set(textContent);
  }

  setGameOver(newValue: boolean) {
    this.gameOver.set(newValue);
  }

  setActualLetterIsActive(status: boolean) {
    this.board()[this.indexActualWord()].letterList[this.indexActualLetter()].isActive = status;
  }

  setActualWordIsActive(status: boolean) {
    this.board()[this.indexActualWord()].isActive = status;
  }

  setValueUserWriting(newValue: string): void {
    this.valueUserWriting.set(newValue);
  }

  setIndexCorrectWord(value: number) {
    this.indexCorrectWord.set(value);
  }

  setIndexCorrectLetter(value: number) {
    this.indexCorrectLetter.set(value);
  }

  setCorrectLetter(value: Letter){
    this.correctLetter.set(value);
  }

  setUserTime(value: string) {
    this.userTime.set(value);
  }

  setUserAccuracy(value: number){
    this.userAccuracy.set(value);
  }

  setGamePercentCompleted(value: number){
    this.gamePercentCompleted.set(value);
  }

  setWordIsCompleted(value: boolean){
    this.board()[this.indexActualWord()].isCompleted = value;
  }

  setIsSoundActive(value: boolean){
    this.isSoundActive.set(value);
  }
}
