import { Component, HostListener, OnInit, effect, inject, signal } from '@angular/core';
import { GameHandlerService } from '../../services/game.handler.service';
import { Letter, LetterStatus, TextContent, Word } from '../../interfaces/entities';
import { texts } from '../../shared/mock/texts.mock';
import { TypingDisplayComponent } from "./components/typing-display/typing-display.component";
import { BoardComponent } from "./components/board/board.component";
import { WordComponent } from './components/board/word/word.component';
import { GameInfoComponent } from "./components/game-info/game-info.component";
import { AppStateService } from '../../services/app-state.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ModalService } from './components/modal/modal.service';
import { ModalComponent } from './components/modal/modal.component';
import { GameTimerService } from '../../services/game-timer.service';

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
  constructor() {
    effect(()=>{
      if(this._appStateService.gameOver()){
        this._gameHandlerService.finishGame()
        return;
      }
    }, {allowSignalWrites: true})

  }

  ngOnInit(): void {
    this._gameHandlerService.startNewGame();
  }



}
