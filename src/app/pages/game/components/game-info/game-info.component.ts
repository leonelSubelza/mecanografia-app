import { Component, effect, inject, OnInit } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { AppStateService } from '../../../../services/app-state.service';
import { GameTimerService } from '../../../../services/game-timer.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements OnInit{
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  _userTimerService = inject(GameTimerService);

  gamePercentCompleted: number = 0;
  efaccuracy: number = 100;
  time: string = '';

  constructor(){
    effect(()=>{
      if(this._appStateService.gameOver()){
        console.log("se actualiza lpro ultima gez");
        
        this.updatePercentCompleted()
        return;
      }

      if(this._appStateService.indexActualWord()){
        this.updatePercentCompleted();
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
    
  }

  updatePercentCompleted(){
    const totalWords = this._appStateService.board().length;
    console.log("total words: "+totalWords);
    
    const totalWordCompleted = this._appStateService.indexActualWord();
    console.log("total words completed: "+totalWordCompleted);
    
    console.log((totalWordCompleted*100));
    
    const totalPercent = (totalWordCompleted*100)/totalWords;
    this.gamePercentCompleted = Math.floor(totalPercent);
  }

  startTimer(){
    this._userTimerService.startGameTimer();
  }
  stopTimer(){
    this._userTimerService.stopGameTimer();
  }
}
