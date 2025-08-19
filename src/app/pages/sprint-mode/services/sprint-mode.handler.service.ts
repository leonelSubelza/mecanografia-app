import { effect, inject, Injectable, signal } from '@angular/core';
import { Letter, LetterStatus } from '../../../interfaces/entities';
import { GameTimerService, GeneralStatsService } from '@/services';
import {
  GameOverlayDialogComponent,
  GameOverlayDialogService,
} from '@/components';

const CORRECT_LETTER_DEFAULT_VALUE = {
  id: '00',
  letter: '',
  index: 0,
  isActive: false,
  status: LetterStatus.DEFAULT,
};

const PUNCTUATION_PERFECT_SCORE = 10;
const PUNCTUATION_NORMAL_SCORE = 5;

async function getWordsByLength(length: number): Promise<string[]> {
  switch (length) {
    case 5:
      return (await import('@/shared/mock/words/5')).fiveLetterWords;
    case 6:
      return (await import('@/shared/mock/words/6')).sixLetterWords;
    default:
      throw new Error('Unsupported word length');
  }
}

@Injectable({
  providedIn: 'root',
})
export class SprintModeHandlerService {
  _generalStatsService = inject(GeneralStatsService);
  _timerService = inject(GameTimerService);
  _gameOverlayDialogService = inject(GameOverlayDialogService);

  gameOver = signal<boolean>(false);
  userTime = signal<string>('');
  userScore = signal<number>(0);
  bestScore = signal<number>(0);
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
    effect(
      () => {
        // LOGIC TO FINISH THE GAME
        if (this._timerService.isTimerCountdownFinished()) {
          this.finishGame();
          this.openGameOverlayDialog();
          return;
        }
      },
      { allowSignalWrites: true }
    );
  }

  startNewGameSprintMode() {
    // this.resetAllValues();
    this.resetValues();
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

    const randomWord: string =
      this.getRandomWordFromListLoaded(arrayRandomWords);

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
    this.gameOver.set(false);
    this.userScore.set(0);

    const bestScoreLoaded =
      this._generalStatsService.generalStats().sprintMode?.bestScore;
    this.bestScore.set(bestScoreLoaded ? bestScoreLoaded : 0);

    this._timerService.resetUserTimeCountdown();
  }

  loadNewWord() {
    this.addScore();
    this.setNewRandomWordSprintMode(this.difficulty());
  }

  finishGame() {
    this._timerService.stopGameTimer();
    this.gameOver.set(true);

    if (this.isActualScoreBestScore()) {
      this.updateBestScore();
    }
  }

  addScore(type: 'perfect' | 'normal' = 'normal') {
    if (type === 'perfect') {
      this.userScore.update((prev: number) => prev + PUNCTUATION_PERFECT_SCORE);
    }
    if (type === 'normal') {
      this.userScore.update((prev: number) => prev + PUNCTUATION_NORMAL_SCORE);
    }
  }

  updateBestScore() {
    this.bestScore.set(this.userScore());
    let generalStatsValue = this._generalStatsService.generalStats();
    if (generalStatsValue.sprintMode) {
      generalStatsValue.sprintMode.bestScore = this.userScore();
    } else {
      generalStatsValue.sprintMode = {
        bestScore: this.userScore(),
      };
    }
    this._generalStatsService.setStatsLocalStorage(generalStatsValue);
  }

  isActualScoreBestScore(): boolean {
    return this.userScore() > this.bestScore();
  }

  openGameOverlayDialog() {
    const data = {
      gameType: 'sprint',
      modalTitle: 'Juego Terminado',
      isNewRecord: this.isActualScoreBestScore(),
      score: this.userScore(),
      time: this._timerService.userTime(),
    };
    const dialogRef =
      this._gameOverlayDialogService.openModal<GameOverlayDialogComponent>(
        GameOverlayDialogComponent,
        data
      );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      switch (result.action) {
        case 'newGame':
          this.startNewGameSprintMode();
          break;
        case 'resetGame':
          this.startNewGameSprintMode();
          break;
        default:
          break;
      }
    });
    /**
     *     const data = { message: '¿Está seguro que desea iniciar una nueva partida?'};
         const dialogRef = this._confirmationDialogService.openModal<ConfirmationDialogComponent>(ConfirmationDialogComponent,data);
     
         dialogRef.afterClosed().subscribe((result) => {
           if (!result) return;
     
           switch (result.action) {
             case 'accept':
               // this._gameHandlerService.startNewGame();
               this.onStartNewGame.emit();
               break;
             default:
               break;
           }
         });
     */
  }
}
