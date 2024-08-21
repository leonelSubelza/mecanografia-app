import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { MatCardModule } from '@angular/material/card';
import { Word } from '../../../../interfaces/entities';
import { AppStateService } from '../../../../services/app-state.service';

@Component({
  selector: 'app-typing-display',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './typing-display.component.html',
  styleUrl: './typing-display.component.css'
})
export class TypingDisplayComponent implements OnInit{

  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  currentWord!: string;

  constructor(){
    effect(()=> {
      if(this._appStateService.indexCorrectWord()) {
        if(this._appStateService.getActualWord()){
          this._appStateService.setValueUserWriting('');
          this.currentWord = this._appStateService.getActualWord().word;
        }
      }
    }, {allowSignalWrites: true})
  }
  ngOnInit(): void {
    let correctWord: Word = this._appStateService.getActualWord();
    if(correctWord){
      this.currentWord = correctWord.word;
    }
  }
}

// ARREGLAR QUE NO SE CAMBIA LA CORRECT WORD CUANDO SE LE DA BACKSPACE
// ARREGLAR QUE NO SE MUESTRA SUBRAYADA LA PALABRA ACTUAL