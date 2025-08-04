import { Component, inject } from '@angular/core';
import { GameHandlerService } from '@game-mode/game.handler.service';
import { WordComponent } from './word/word.component';
import { MatCardModule } from '@angular/material/card';
import { AppStateService } from '@/services/app-state.service';
import { GameTimerService } from '@/services/game-timer.service';
import { UserAccuracyService } from '@/services/user-accuracy.service';
import { BoardHandlerService } from './board-handler.service';

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


}
