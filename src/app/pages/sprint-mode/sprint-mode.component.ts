import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SprintModeHandlerService } from '@/pages/sprint-mode/services/sprint-mode.handler.service';
import { SprintBoardComponent } from './sprint-board/sprint-board.component';
import { SprintModeBoardHandlerService } from './sprint-mode-board.handler.service';
import { FormsModule } from '@angular/forms';
import { GameTimerService } from '@/services';
import { ToolbarComponent, TypingDisplayComponent } from '@/components';

const ANGULAR_MATERIAL_IMPORTS = [MatCardModule, MatButtonModule,MatCardModule, MatButtonModule, ];

@Component({
  selector: 'app-sprint-mode',
  standalone: true,
  imports: [ANGULAR_MATERIAL_IMPORTS,SprintBoardComponent,FormsModule,TypingDisplayComponent,ToolbarComponent],
  templateUrl: './sprint-mode.component.html',
  styleUrl: './sprint-mode.component.css'
})
export class SprintModeComponent implements OnInit {
  _sprintModeHandlerService = inject(SprintModeHandlerService);
  _sprintModeBoardHandlerService = inject(SprintModeBoardHandlerService);

  _timerService = inject(GameTimerService);
  // _boardHandlerService = inject(BoardHandlerService);
  // _appStateService = inject(AppStateService);
  // valueUserWriting: string = '';
  // inputEvaluated = signal<string>('');

  constructor() {
    effect(()=>{
      // if(this._appStateService.gameOver()){
      //  console.log(this._appStateService.board());
      //  console.log(this._appStateService.correctLetter());
      // }
    }, {allowSignalWrites: true})

  }

  ngOnInit(): void {
    this._sprintModeHandlerService.startNewGameSprintMode();
  }

  handleInputWritten($event: string) {

    console.log("key pulsada en modo sprint:" + $event);
    this._sprintModeBoardHandlerService.handleLetterWritten($event);
  }
  /*
  handleInput($event: any){
    $event.preventDefault();
    let key: string=$event.data;

    
    const textWritten = $event.target.value;
    if(this.inputEvaluated() === ''){
      this.inputEvaluated.set(textWritten);
    }else{
      if(this.inputEvaluated() === textWritten) {
        return;
      }
    }
    
    // if the input has text, then we handle the delete. This is because of the mobile not recognize the keyboard if the input has text
    if(key===null && this._sprintModeHandlerService.valueUserWritingSprintMode()!=='') {
      key='Backspace';
      console.log("se cambia key a Backspace");
      
    }
    // if the key is null means the user pressed on Backspace button
    if(key===null && this._sprintModeHandlerService.valueUserWritingSprintMode()==='') {
      console.log("el input era vacio. return");
      return;
    }
    
    
    this.inputEvaluated.set(textWritten);  
    this._sprintModeBoardHandlerService.handleLetterWritten(key);
    this._sprintModeHandlerService.valueUserWritingSprintMode.set(this.valueUserWriting);
  }

  preventPaste($event: any){

  }
  */
 handleRestartGame() {
  this._sprintModeHandlerService.startNewGameSprintMode();
 }
 handleNewGame() {
  this._sprintModeHandlerService.startNewGameSprintMode();
 }
}
