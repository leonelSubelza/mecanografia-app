import { Component, HostListener, inject } from '@angular/core';
import { Letter, LetterStatus, Word } from '../../../../interfaces/entities';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { WordComponent } from './word/word.component';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { AppStateService } from '../../../../services/app-state.service';
import { GameTimerService } from '../../../../services/game-timer.service';
import { UserAccuracyService } from '../../../../services/user-accuracy.service';
import { BoardHandlerService } from '../../board-handler.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [WordComponent,MatCardModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _gameTimerService = inject(GameTimerService);
  _userAccuracyService = inject(UserAccuracyService);

  _boardHandlerService = inject(BoardHandlerService);
  constructor() {}

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {    
    const { key } = event;
    // The keyboard event only work when the input has no text
    if((key==='Backspace')&&this._appStateService.valueUserWriting()===''){
      this._boardHandlerService.handleLetterWritten(key);
    }
  }
}
