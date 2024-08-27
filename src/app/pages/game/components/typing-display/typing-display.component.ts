import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { MatCardModule } from '@angular/material/card';
import { Word } from '../../../../interfaces/entities';
import { AppStateService } from '../../../../services/app-state.service';
import { BoardHandlerService } from '../../board-handler.service';

@Component({
  selector: 'app-typing-display',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './typing-display.component.html',
  styleUrl: './typing-display.component.css',
})
export class TypingDisplayComponent implements OnInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _boardHandlerService = inject(BoardHandlerService);

  currentWord!: string;

  constructor() {
    effect(() => {
        if (!this._appStateService.gameOver()) {
          this.handleUpdateCurrentWord();
        }
        if (this._appStateService.indexCorrectWord()) {
          this.handleUpdateCurrentWord();
        }
      },
      { allowSignalWrites: true }
    );
  }
  ngOnInit(): void {
    let correctWord: Word = this._appStateService.getActualWord();
    if (correctWord) {
      this.currentWord = correctWord.word;
    }
  }

  handleUpdateCurrentWord() {
    if (this._appStateService.getActualWord()) {
      this._appStateService.setValueUserWriting('');
      this.currentWord = this._appStateService.getActualWord().word;
    }
  }

  handleInput($event: any){
    $event.preventDefault();
    let key: string=$event.data;

    // if the input has text, then we handle the delete. This is because of the mobile not recognize the keyboard if the input has text
    if(key===null&&this._appStateService.valueUserWriting()!==''){
      key='Backspace';
    }
    // if the key is null means the user pressed on Backspace button
    if(key===null&&this._appStateService.valueUserWriting()==='') {
      return;
    }
    
    this._boardHandlerService.handleLetterWritten(key);
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault(); // Evita que ocurra la acción de pegar
    alert('no podes pegar pelotudo')
  }
  
}