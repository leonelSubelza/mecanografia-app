import { effect, inject, Injectable, signal } from '@angular/core';
import { Letter, LetterStatus } from '../../../interfaces/entities';
import { GameTimerService } from '@/services';

const CORRECT_LETTER_DEFAULT_VALUE = {
  id: '00',
  letter: '',
  index: 0,
  isActive: false,
  status: LetterStatus.DEFAULT,
};

async function getWordsByLength(length: number): Promise<string[]> {
  switch (length) {
    case 5:
      return (await import('../../../shared/mock/words/5')).fiveLetterWords;
    case 6:
      return (await import('../../../shared/mock/words/6')).sixLetterWords;
    default:
      throw new Error('Unsupported word length');
  }
}

@Injectable({
  providedIn: 'root',
})
export class SprintModeHandlerService {
  _timerService = inject(GameTimerService);

  gameOver = signal<boolean>(false);
  userTime = signal<string>('');
  userScore = signal<number>(0);
  isSoundActive = signal<boolean>(true);
  difficulty = signal<number>(5);

  listWordsLoaded = signal<string[]>([]);
  currentWord = signal<string>('');
  wordsPlayed = signal<string[]>([]);

  wordBoard = signal<Letter[]>([]);
  indexActualLetter = signal<number>(0);
  indexCorrectLetter = signal<number>(0);
  // correctLetter = signal<Letter>(CORRECT_LETTER_DEFAULT_VALUE);
  valueUserWritingSprintMode = signal<string>('');
  /**
 *   board = signal<Word[]>([]);
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
 * 
 */
  constructor() {
    // Esto es como un "thread reactivo"
    effect(() => {
      if (this._timerService.isTimerCountdownFinished()) {
        this.finishGame();
        return;
      }
    }, {allowSignalWrites: true});
  }

  startNewGameSprintMode() {
    // this.resetAllValues();
    this.setNewRandomWordSprintMode(this.difficulty());
  }

  async setNewRandomWordSprintMode(cantLetters: number = 5) {
    let arrayRandomWords: string[];
    if (
      this.difficulty() !== cantLetters ||
      !this.listWordsLoaded() ||
      this.listWordsLoaded().length === 0
    ) {
      arrayRandomWords = await getWordsByLength(cantLetters);
    } else {
      arrayRandomWords = this.listWordsLoaded();
    }

    if (this.currentWord() !== '') {
      this.wordsPlayed.set([...this.wordsPlayed(), this.currentWord()]);
    }

    const randomWord: string = this.getRandomWordFromListLoaded(arrayRandomWords);

    this.currentWord.set(randomWord);
    this.listWordsLoaded.set(arrayRandomWords);
    this.setStartValues(randomWord);
  }

  setStartValues(randomWord: string) {
    const board: Letter[] = this.generateBoard(randomWord);

    this.indexActualLetter.set(0);
    this.indexCorrectLetter.set(0);
    this.valueUserWritingSprintMode.set('');
    this.wordBoard.set(board);
    this.updateActualLetterStatusActive(true);
  }

  generateBoard(text: string): Letter[] {
    return text.split('').map((letter: string, index: number) => ({
      id: index.toString() + letter,
      letter: letter,
      index: index,
      isActive: false,
      status: LetterStatus.DEFAULT,
    }));
  }

  getRandomWordFromListLoaded(arrayRandomWords: string[]): string {
    let indexRandomWord: number = Math.floor(
      Math.random() * arrayRandomWords.length
    );

    while (this.wordsPlayed().includes(arrayRandomWords[indexRandomWord])) {
      indexRandomWord = Math.floor(Math.random() * arrayRandomWords.length);
    }

    return arrayRandomWords[indexRandomWord];
  }

  updateActualLetterStatus(status: LetterStatus) {
    this.wordBoard()[this.indexActualLetter()].status = status;
  }

  updateActualLetterStatusActive(status: boolean) {
    this.wordBoard()[this.indexActualLetter()].isActive = status;
  }

  resetValues() {
    this.valueUserWritingSprintMode.set('');
  }

  loadNewWord() {
    this.setNewRandomWordSprintMode(this.difficulty());
  }

  finishGame() {
    this._timerService.stopGameTimer();
    this.gameOver.set(true);
  }
}
