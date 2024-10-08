import { AfterViewInit, Component, OnInit, effect, inject } from '@angular/core';
import { GameHandlerService } from '../../services/game.handler.service';
import { TypingDisplayComponent } from "./components/typing-display/typing-display.component";
import { BoardComponent } from "./components/board/board.component";
import { WordComponent } from './components/board/word/word.component';
import { GameInfoComponent } from "./components/game-info/game-info.component";
import { AppStateService } from '../../services/app-state.service';
import { GeneralStatsService } from '../../services/general-stats.service';
import * as confetti from 'canvas-confetti';
import { CpmService } from '../../services/cpm.service';
import { Stats } from '../../interfaces/entities';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './components/modal/modal.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [WordComponent, TypingDisplayComponent, BoardComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, AfterViewInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _generalStatsService = inject(GeneralStatsService);
  _cpmService = inject(CpmService)
  _modalService = inject(ModalService);
  
  private confettiInstance: any;
  private gameFinished: boolean = false;

  constructor() {
    effect(()=>{
      if(this._appStateService.gameOver() && !this.gameFinished){
        this._gameHandlerService.finishGame();
        let isNewRecord = this.updateActualGameStats();
        this.handleGameFinished(isNewRecord);
      }
      if(!this._appStateService.gameOver()){
        this.gameFinished = false;
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
    this._gameHandlerService.startNewGame();
  }

  ngAfterViewInit() {
    // Crear el lienzo que cubrirá toda la ventana
    this.confettiInstance = confetti.create(undefined, {
      resize: true, // Asegura que el lienzo se redimensione con la ventana
      useWorker: true // Opcional: mejora el rendimiento en algunos casos
    });
  }

  celebrate() {
    const duration = 3000; // en milisegundos
    this.confettiInstance({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.5 } // Centrado en la pantalla
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
      cpm: this._cpmService.cpm()
    }
    if(this._generalStatsService.actualGameIsBetter(actualGameStats)){      
      this._generalStatsService.setStatsLocalStorage(actualGameStats);
      
      if(this._appStateService.isSoundActive()) {
        this.playApplauseSound();
      }
      this.celebrate()
      return true
    }
    return false;
  }

  playApplauseSound(){
    const audio = new Audio('sounds/applauseSound.mp3');
    audio.play();
  }

  handleGameFinished(isNewRecord: boolean){
    this.gameFinished = true;
    const data = {
      title:"Juego Completado!",
      isNewRecord:isNewRecord
    }
    this._modalService.openModal<ModalComponent>(ModalComponent,data);
  }
}
