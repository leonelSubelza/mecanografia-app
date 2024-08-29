import { Component, effect, inject, OnInit } from '@angular/core';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { MatCardModule } from '@angular/material/card';
import { Word } from '../../../../interfaces/entities';
import { AppStateService } from '../../../../services/app-state.service';
import { BoardHandlerService } from '../../board-handler.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-typing-display',
  standalone: true,
  imports: [MatCardModule,NgClass,MatButtonModule],
  templateUrl: './typing-display.component.html',
  styleUrl: './typing-display.component.css',
})
export class TypingDisplayComponent implements OnInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _boardHandlerService = inject(BoardHandlerService);

  currentWord!: string;

  showTooltipMessage: boolean = true;

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
7  }

  ngOnInit(): void {
    let correctWord: Word = this._appStateService.getActualWord();
    if (correctWord) {
      this.currentWord = correctWord.word;
    }
    // console.log(this.tooltip);
  }

  handleUpdateCurrentWord() {
    let correctWord = this._appStateService.board()[this._appStateService.indexCorrectWord()];
    if (correctWord) {
      this._appStateService.setValueUserWriting('');
      this.currentWord = correctWord.word;
    }
  }

  handleInput($event: any){
    $event.preventDefault();
    this.hideTooltip()
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

  hideTooltip(){
    this.showTooltipMessage = false;
  }
}