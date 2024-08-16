import { Component, OnInit, effect, inject, input } from '@angular/core';
import { LetterComponent } from './letter/letter.component';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { Word } from '../../../../interfaces/entities';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [LetterComponent],
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

    }, {allowSignalWrites: true})
  }

  // execute after the constructor function
  ngOnInit(): void { }
}
