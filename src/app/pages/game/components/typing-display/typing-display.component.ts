import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { MatCardModule } from '@angular/material/card';
import { Word } from '../../../../interfaces/entities';

@Component({
  selector: 'app-typing-display',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './typing-display.component.html',
  styleUrl: './typing-display.component.css'
})
export class TypingDisplayComponent implements OnInit{

  _gameHandlerService = inject(GameHandlerService);
  currentWord!: string;

  constructor(){
    effect(()=> {
      if(this._gameHandlerService.indexCorrectWord()) {
        this._gameHandlerService.setValueUserWriting('');
        this.currentWord = this._gameHandlerService.getActualWord().word;
      }
    }, {allowSignalWrites: true})
  }
  ngOnInit(): void {
    let correctWord: Word = this._gameHandlerService.getActualWord();
    if(correctWord){
      this.currentWord = correctWord.word;
    }
  }
}

// ARREGLAR QUE NO SE CAMBIA LA CORRECT WORD CUANDO SE LE DA BACKSPACE
// ARREGLAR QUE NO SE MUESTRA SUBRAYADA LA PALABRA ACTUAL