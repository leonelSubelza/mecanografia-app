import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { GameHandlerService } from '@game-mode/game.handler.service';
import { MatCardModule } from '@angular/material/card';
import { AppStateService } from '@/services/app-state.service';
import { BoardHandlerService } from '../../pages/game/components/board/board-handler.service';
import { MatButtonModule } from '@angular/material/button';
import {  NgClass } from '@angular/common';

@Component({
  selector: 'app-typing-display',
  standalone: true,
  imports: [MatCardModule, NgClass, MatButtonModule],
  templateUrl: './typing-display.component.html',
  styleUrl: './typing-display.component.css',
})
export class TypingDisplayComponent implements OnInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _boardHandlerService = inject(BoardHandlerService);

  input = input.required<string>();
  currentWord = input<string>();
  onInput = output<string>();

  // isMobile = signal<boolean>(false);
  textAux = '';

  inputEvaluated = signal<string>('');

  comparadorStack = signal<string[]>([]);
  inputStack = signal<string[]>([]);

  // currentWord!: string;

  showTooltipMessage: boolean = true;
  // inputElement = viewChild<HTMLInputElement>('inputRef');

  constructor() {
    effect(
      () => {
        // if (!this._appStateService.gameOver()) {
        //   this.handleUpdateCurrentWord();
        // }

        // if (this._appStateService.indexCorrectWord()) {
        //   this.handleUpdateCurrentWord();
        // }

        // if (window.innerWidth < 1000) {
        //   const el4 = document.getElementById('textareaRef');
        //   el4?.focus();
        //   this.isMobile.set(true);
        // } else {
        //   const el4 = document.getElementById('inputRef');
        //   el4?.focus();
        //   this.isMobile.set(false);
        // }
      },
      { allowSignalWrites: true }
    );
    7;
  }

  ngOnInit(): void {
    // let correctWord: Word = this._appStateService.getActualWord();
    // if (correctWord) {
    //   this.currentWord = correctWord.word;
    // }
  }

  // handleUpdateCurrentWord() {
  //   let correctWord =
  //     this._appStateService.board()[this._appStateService.indexCorrectWord()];
  //   if (correctWord) {
  //     if(!this.isMobile()) {
  //       this._appStateService.setValueUserWriting('');
  //     }
  //     this.currentWord = correctWord.word;
  //   }
  // }

  handleInput($event: any){
    $event.preventDefault();
    this.hideTooltip()
    let key: string=$event.data;


    // On mobile, there was a bug where the keyboard, when typing a word one letter long, executed the letter's input event twice, which generated an error, for example you write "y " and its generated "yy " as events.
    // Therefore, the variable inputEvaluated was created to compare the texts that were already executed so as not to execute the same event twice.    
    const textWritten = $event.target.value;
    if(this.inputEvaluated() === ''){
      this.inputEvaluated.set(textWritten);
    }else{
      if(this.inputEvaluated() === textWritten) {
        return;
      }
    }


    console.log("texto escrito: "+this.input());
    
    // if the input has text, then we handle the delete. This is because of the mobile not recognize the keyboard if the input has text
    // if(key===null&&this._appStateService.valueUserWriting()!=='') {
    if(key===null&&this.input()!=='') {
      key='Backspace';
      console.log("se cambia key a Backspace");
    }
    // if the key is null means the user pressed on Backspace button
    // if(key===null&&this._appStateService.valueUserWriting()==='') {
    if(key===null&&this.input()==='') {
      console.log("Se pulsó Backspace y no habia texto, se retorna");
      return;
    }
    // if(this.isMobile()) {
      // this.inputStack.set([...this.inputStack(), key]);    
      // return;
    // }

    this.inputEvaluated.set(textWritten);  
    // this._boardHandlerService.handleLetterWritten(key);
    this.onInput.emit(key);
  }
  
  preventPaste(event: ClipboardEvent) {
    event.preventDefault(); // Evita que ocurra la acción de pegar
    alert('no podes pegar pelotudo');
  }

  hideTooltip() {
    this.showTooltipMessage = false;
  }
}
