import { Component, effect, inject, OnInit } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { AppStateService } from '../../../../services/app-state.service';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements OnInit{
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  gamePercentCompleted: number = 0;
  efaccuracy: number = 100;
  time: string = '';

  constructor(){
    effect(()=>{
      if(this._appStateService.gameOver()){
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
    const totalWords = this._appStateService.board().length-1;
    console.log("total words: "+totalWords);
    
    const totalWordCompleted = this._appStateService.indexActualWord();
    console.log("total words completed: "+totalWordCompleted);
    
    console.log((totalWordCompleted*100));
    
    const totalPercent = (totalWordCompleted*100)/totalWords;
    this.gamePercentCompleted = Math.round(totalPercent);
  }
}
