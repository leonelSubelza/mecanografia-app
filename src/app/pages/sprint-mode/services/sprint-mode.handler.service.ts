import { effect, inject, Injectable, signal } from '@angular/core';
import { Letter, LetterStatus, ScoreToShow } from '@/interfaces/entities';
import { CpmService, GameTimerService, GeneralStatsService } from '@/services';
import {
  GameOverlayDialogComponent,
  GameOverlayDialogService,
} from '@/components';
import { Router } from '@angular/router';

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
  _cpmService = inject(CpmService);

  gameOver = signal<boolean>(false);
  showStartScreen = signal<boolean>(true);
  userTime = signal<string>('');

  userScore = signal<number>(0);
  bestScore = signal<number>(0);
  scoreToShowStack = signal<ScoreToShow[]>([]);

  isSoundActive = signal<boolean>(true);
  difficulty = signal<number>(5);

  listWordsLoaded = signal<string[]>([]);
  currentWord = signal<string>('');
  wordsPlayed = signal<string[]>([]);

  wordBoard = signal<Letter[]>([]);
  indexActualLetter = signal<number>(0);
  indexCorrectLetter = signal<number>(0);
  valueUserWritingSprintMode = signal<string>('');

  router = inject(Router);

  constructor() {
    // Esto es como un "thread reactivo"
    effect(() => {
      // LOGIC TO FINISH THE GAME
      if (this._timerService.isTimerCountdownFinished() && !this.gameOver() && this.router.url === '/sprint-mode') {
        this.openGameOverlayDialog();
        this.finishGame();
        return;
      }
    });
  }

  startNewGameSprintMode() {
    // this.resetAllValues();
    this.resetValues();
    this.setNewRandomWordSprintMode(this.difficulty());
  }

  async setNewRandomWordSprintMode(
    cantLetters: number = 5,
    includeWordsWithAccents: boolean = false
  ) {
    let arrayRandomWords: string[];
    if (
      this.difficulty() !== cantLetters ||
      !this.listWordsLoaded() ||
      this.listWordsLoaded().length === 0
    ) {
      arrayRandomWords = await getWordsByLength(cantLetters);
      if (!includeWordsWithAccents) {
        arrayRandomWords = this.removeWordsWithAccents(arrayRandomWords);
      }
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

  removeWordsWithAccents(loadedWords: string[]): string[] {
    const accents = [
      'á',
      'é',
      'í',
      'ó',
      'ú',
      'Á',
      'É',
      'Í',
      'Ó',
      'Ú',
      'ü',
      'Ü',
    ];

    return loadedWords.filter(
      (word) => !accents.some((acc) => word.includes(acc))
    );
  }

  getRandomWordFromListLoaded(arrayRandomWords: string[]): string {
    let indexRandomWord: number = Math.floor(
      Math.random() * arrayRandomWords.length
    );

    if (this.wordsPlayed().length === arrayRandomWords.length) {
      alert('NO HAY MÁS PALABRAS XD');
      return '';
    }
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
    this._cpmService.resetCPM();
    this.showStartScreen.set(true);

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
    this._cpmService.finishCPM();

    if (this._generalStatsService.generalStats().sound) this.playFinishSound();

    if (this.isActualScoreBestScore()) {
      this.updateBestScore();
    }
  }

  startGame() {
    this._timerService.startCountDownGameTimer();
    this._cpmService.startCPM();
  }

  restartGameAndGoToStartScreen() {
    this.resetValues();
    this.startNewGameSprintMode();
  }

  restartGameAndStartPlaying() {
    this.resetValues();
    this.startNewGameSprintMode();
    this.startButtonClick();
  }

  addScore(type: 'perfect' | 'normal' = 'normal') {
    if (type === 'perfect') {
      this.userScore.update((prev: number) => prev + PUNCTUATION_PERFECT_SCORE);
      this.scoreToShowStack().push({
        message: '+' + PUNCTUATION_PERFECT_SCORE,
        type,
      });
    }
    if (type === 'normal') {
      this.userScore.update((prev: number) => prev + PUNCTUATION_NORMAL_SCORE);
      this.scoreToShowStack().push({
        message: '+' + PUNCTUATION_NORMAL_SCORE,
        type,
      });
    }
    setTimeout(() => {
      this.scoreToShowStack().pop();
    }, 500);
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
    this._generalStatsService.setStats(generalStatsValue);
  }

  isActualScoreBestScore(): boolean {
    return this.userScore() > this.bestScore();
  }

  openGameOverlayDialog() {
    this._cpmService.finishCPM();
    const data = {
      gameType: 'sprint',
      title: 'Juego Terminado',
      isNewRecord: this.isActualScoreBestScore(),
      score: this.userScore(),
      time: this._timerService.userTime(),
      cpmValue: this._cpmService.cpm(),
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
          this.restartGameAndGoToStartScreen();
          break;
        case 'resetGame':
          this.restartGameAndStartPlaying();
          break;
        default:
          break;
      }
    });
  }

  // VA A HABER QUE MOVER LA LOGICA DEL BOTON COMENZAR A ACÁ

  playFinishSound() {
    new Audio('sounds/sprint-mode/gong.wav').play();
  }

  sequence = ['', '3', '2', '1', 'GO!'];
  currentIndex = signal<number | null>(null); // cuál mostrar
  isVisible = signal(false); // para animación fade
  intervalTime = 300; // 0.5s

  private countdownTimer: any;
  showButton = signal(true);

  startButtonClick() {
    // Ocultamos el botón con fade-out
    console.log('se oculta el botón');

    this.showButton.set(false);

    // Esperamos 0.5s para iniciar la cuenta (cuando termina la animación del botón)
    setTimeout(() => {
      this.startCountdown();
      // this.showButton.set(true);
    }, 200);
  }

  private startCountdown() {
    let index = 0;
    this.currentIndex.set(index);
    this.isVisible.set(true);

    this.countdownTimer = setInterval(() => {
      this.isVisible.set(false);

      setTimeout(() => {
        index++;
        if (index < this.sequence.length) {
          this.currentIndex.set(index);
          this.isVisible.set(true);
        } else {
          clearInterval(this.countdownTimer);

          // Cuando termina, restauramos todo
          setTimeout(() => {
            this.currentIndex.set(null);
            this.showButton.set(true);
            this.showStartScreen.set(false);
            this.startGame();
            // this.setFocusOnInput();
          }, 150);
        }
      }, 150);
    }, 600);
  }
}
