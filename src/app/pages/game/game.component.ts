import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { GameHandlerService } from './game.handler.service';
import { TypingDisplayComponent } from './components/typing-display/typing-display.component';
import { BoardComponent } from './components/board/board.component';
import { GameInfoComponent } from './components/game-info/game-info.component';
import { AppStateService } from '../../services/app-state.service';
import { GeneralStatsService } from '../../services/general-stats.service';
import * as confetti from 'canvas-confetti';
import { CpmService } from '../../services/cpm.service';
import { Stats, Word } from '../../interfaces/entities';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './components/modal/modal.service';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { BoardHandlerService } from './components/board/board-handler.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TypingDisplayComponent, BoardComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, AfterViewInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _generalStatsService = inject(GeneralStatsService);
  _cpmService = inject(CpmService);
  _modalService = inject(ModalService);
  _boardHandlerService = inject(BoardHandlerService);

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
      bestTextContent: this._appStateService.textContent(),
      bestTime: this._appStateService.userTime(),
      bestAccuracy: this._appStateService.userAccuracy(),
      cpm: this._cpmService.cpm(),
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
    const data = {
      title: 'Juego Completado!',
      isNewRecord: isNewRecord,
    };
    this._modalService.openModal<ModalComponent>(ModalComponent, data);
  }

  handleInputWritten($event: string){

    console.log("key pulsada en modo normal:" + $event);
    
    this._boardHandlerService.handleLetterWritten($event);
  }
}
