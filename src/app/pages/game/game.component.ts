import {
  AfterViewInit,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { GameHandlerService } from './game.handler.service';
import { BoardComponent } from '@game-mode/components/board/board.component';
import * as confetti from 'canvas-confetti';
import { Stats, Word } from '@/interfaces/entities';
import { GameInfoComponent } from './components/game-info/game-info.component';
import {
  AppStateService,
  CpmService,
  GameTimerService,
  GeneralStatsService,
} from '@/services';
import { BoardHandlerService } from './components/board/board-handler.service';
import { GameOverlayDialogComponent, GameOverlayDialogService, ToolbarComponent, TypingDisplayComponent } from '@/components';

@Component({
    selector: 'app-game',
    imports: [TypingDisplayComponent, BoardComponent, GameInfoComponent, ToolbarComponent],
    standalone: true,
    templateUrl: './game.component.html',
    styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, AfterViewInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _generalStatsService = inject(GeneralStatsService);
  _gameOverlayDialogService = inject(GameOverlayDialogService);
  _boardHandlerService = inject(BoardHandlerService);
  _cpmService = inject(CpmService);
  _gameTimerService = inject(GameTimerService);

  isMobile = signal<boolean>(false);
  currentWord!: string;

  private confettiInstance: any;
  private gameFinished: boolean = false;

  constructor() {
    effect(
      () => {
        if (this._appStateService.gameOver() && !this.gameFinished) {
          this._gameHandlerService.finishGame();
          let isNewRecord = this.updateActualGameStats();
          this.handleGameFinished(isNewRecord);
        }
        if (!this._appStateService.gameOver()) {
          this.gameFinished = false;
        }

        if (!this._appStateService.gameOver()) {
          this.handleUpdateCurrentWord();
        }

        if (this._appStateService.indexCorrectWord()) {
          this.handleUpdateCurrentWord();
        }

        if (window.innerWidth < 1000) {
          const el4 = document.getElementById('textareaRef');
          el4?.focus();
          this.isMobile.set(true);
        } else {
          const el4 = document.getElementById('inputRef');
          el4?.focus();
          this.isMobile.set(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this._gameHandlerService.startNewGame();

    let correctWord: Word = this._appStateService.getActualWord();
    if (correctWord) {
      this.currentWord = correctWord.word;
    }
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   const { key } = event;
  //   console.log("Tecla presionada en tu teclado: "+key);

  //   // The keyboard event only work when the input has no text
  //   if((key==='Backspace')&&this._appStateService.valueUserWriting()==='') {
  //     this._boardHandlerService.handleLetterWritten(key);
  //   }
  // }

  ngAfterViewInit() {
    // Crear el lienzo que cubrirá toda la ventana
    this.confettiInstance = confetti.create(undefined, {
      resize: true, // Asegura que el lienzo se redimensione con la ventana
      useWorker: true, // Opcional: mejora el rendimiento en algunos casos
    });
  }

  handleUpdateCurrentWord() {
    let correctWord =
      this._appStateService.board()[this._appStateService.indexCorrectWord()];
    if (correctWord) {
      if (!this.isMobile()) {
        this._appStateService.setValueUserWriting('');
      }
      this.currentWord = correctWord.word;
    }
  }

  celebrate() {
    const duration = 3000; // en milisegundos
    this.confettiInstance({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.5 }, // Centrado en la pantalla
    });

    // Limpiar el confeti después de cierto tiempo
    setTimeout(() => this.confettiInstance.reset(), duration);
  }

  updateActualGameStats(): boolean {
    const actualGameStats: Stats = {
      username: this._generalStatsService.generalStats().username,
      normalMode: {
        bestTextContent: this._appStateService.textContent(),
        bestTime: this._appStateService.userTime(),
        bestAccuracy: this._appStateService.userAccuracy(),
        cpm: this._cpmService.cpm(),
      }
    };
    if (this._generalStatsService.actualGameIsBetter(actualGameStats)) {
      this._generalStatsService.setStatsLocalStorage(actualGameStats);

      if (this._appStateService.isSoundActive()) {
        this.playApplauseSound();
      }
      this.celebrate();
      return true;
    }
    return false;
  }

  playApplauseSound() {
    const audio = new Audio('sounds/applauseSound.mp3');
    audio.play();
  }

  handleGameFinished(isNewRecord: boolean) {
    this.gameFinished = true;
    this.openModal(isNewRecord);
  }

  handleInputWritten($event: string) {
    // console.log('key pulsada en modo normal:' + $event);
    this._boardHandlerService.handleLetterWritten($event);
  }

  openModal(isNewRecord: boolean) {
    const data = {
      gameType: 'precision',
      title: 'Juego Completado!',
      isNewRecord: isNewRecord,
      textTitle: this._appStateService.textContent().title,
      accuracy: this._appStateService.userAccuracy(),
      totalTime: this._gameTimerService.userTime(),
      cpmValue: this._cpmService.cpm(),
    };
    const dialogRef = this._gameOverlayDialogService.openModal<GameOverlayDialogComponent>(
      GameOverlayDialogComponent,
      data
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      switch (result.action) {
        case 'newGame':
          this._gameHandlerService.startNewGame();
          break;
        case 'resetGame':
          this._gameHandlerService.restartGame();
          break;
        default:
          break;
      }
    });
  }

  handleNewGame() {
    this._gameHandlerService.startNewGame();
  }

  handleRestartGame() {
    this._gameHandlerService.restartGame();
  }
}
