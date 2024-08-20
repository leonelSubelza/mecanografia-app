import { NgClass } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { Letter } from '../../../../../../interfaces/entities';
import { GameHandlerService } from '../../../../../../services/game.handler.service';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent implements OnInit {
  letter = input.required<Letter>();
  index? = input<number>();

  isValidPosition: boolean = false;
  _gameHandlerService = inject(GameHandlerService);

  constructor(){
    effect(()=>{
      if(this._gameHandlerService.gameOver()){
        return;
      }

      if(this._gameHandlerService.indexActualLetter()){
        if(this.letter().isActive){
          this.isValidPosition = this._gameHandlerService.isCorrectLetter(this.letter().letter)
        }else{
          this.isValidPosition = false;
        }
      }
    }, {allowSignalWrites: true})
  }

  ngOnInit() {
  }

}
