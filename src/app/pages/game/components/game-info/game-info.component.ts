import { Component, effect, inject, OnInit } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { AppStateService } from '../../../../services/app-state.service';
import { GameTimerService } from '../../../../services/game-timer.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { Word } from '../../../../interfaces/entities';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [MatProgressBarModule, MatButtonModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements OnInit{
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  _userTimerService = inject(GameTimerService);

  constructor(){
    effect(()=>{
      if(this._appStateService.gameOver()){
        this.updatePercentCompleted()
        return;
      }

      if(this._appStateService.indexActualWord() || this._appStateService.indexActualWord()===0){
        this.updatePercentCompleted();
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
    
  }

  updatePercentCompleted(){
    const totalWords = this._appStateService.board().length;
    // console.log("total words: "+totalWords);
    
    // const totalWordCompleted = this._appStateService.indexActualWord();
    const totalWordCompleted = this.getTotalWordsCompleted();
    // console.log("total words completed: "+totalWordCompleted);
    
    // console.log((totalWordCompleted*100));
    
    const totalPercent = (totalWordCompleted*100)/totalWords;
    this._appStateService.setGamePercentCompleted(Math.floor(totalPercent));
  }

  startTimer(){
    this._userTimerService.startGameTimer();
  }
  stopTimer(){
    this._userTimerService.stopGameTimer();
  }

  getTotalWordsCompleted(): number{
    let cantWordCompleted = 0;
    this._appStateService.board().forEach( (word: Word) => {
      if(word.isCompleted){
        cantWordCompleted++;
      }
    })
    return cantWordCompleted;
  }
}
