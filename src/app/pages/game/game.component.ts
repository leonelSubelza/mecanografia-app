import { Component, OnInit, effect, inject } from '@angular/core';
import { GameHandlerService } from '../../services/game.handler.service';
import { TypingDisplayComponent } from "./components/typing-display/typing-display.component";
import { BoardComponent } from "./components/board/board.component";
import { WordComponent } from './components/board/word/word.component';
import { GameInfoComponent } from "./components/game-info/game-info.component";
import { AppStateService } from '../../services/app-state.service';
import { ModalService } from './components/modal/modal.service';
import { GameTimerService } from '../../services/game-timer.service';
import { GeneralStatsService } from '../../services/general-stats.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [WordComponent, TypingDisplayComponent, BoardComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _gameTimerService =inject(GameTimerService);
  _modalService = inject(ModalService);
  _generalStatsService = inject(GeneralStatsService);

  constructor() {
    effect(()=>{
      if(this._appStateService.gameOver()){
        this._gameHandlerService.finishGame();
        this.checkActualGameStats();
        return;
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
    this._gameHandlerService.startNewGame();
  }

  checkActualGameStats() {
    const actualGameStats = {
      username: this._generalStatsService.generalStats().username,
      bestTextContent: this._appStateService.textContent(),
      bestTime: this._appStateService.userTime(),
      bestAccuracy: this._appStateService.userAccuracy()
    }
    if(this._generalStatsService.actualGameIsBetter(actualGameStats)){
      this._generalStatsService.setStatsLocalStorage(actualGameStats);
    }
  }
}
