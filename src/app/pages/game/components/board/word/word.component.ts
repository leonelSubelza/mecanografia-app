import { Component, OnInit, effect, inject, input } from '@angular/core';
import { LetterComponent } from './letter/letter.component';
import { GameHandlerService } from '../../../../../services/game.handler.service';
import { Word } from '../../../../../interfaces/entities';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [LetterComponent,NgClass],
  templateUrl: './word.component.html',
  styleUrl: './word.component.css'
})
export class WordComponent implements OnInit{
  index = input.required<number>();
  word = input.required<Word>();

  _gameHandlerService = inject(GameHandlerService);

  constructor() {
    effect(()=>{
      if(this._gameHandlerService.gameOver()){
        return;
      }

      if(this._gameHandlerService.indexActualWord()){
        
      }
    }, {allowSignalWrites: true})
  }

  // execute after the constructor function
  ngOnInit(): void { }
}
