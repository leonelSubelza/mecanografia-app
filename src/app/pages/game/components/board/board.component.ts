import { Component, inject } from '@angular/core';
import { GameHandlerService } from '@game-mode/game.handler.service';
import { WordComponent } from './word/word.component';
import { MatCardModule } from '@angular/material/card';
import { AppStateService } from '@/pages/game/services/app-state.service';
import { GameTimerService } from '@/services/game-timer.service';
import { UserAccuracyService } from '@/pages/game/services/user-accuracy.service';
import { BoardHandlerService } from './board-handler.service';

@Component({
    selector: 'app-board',
    imports: [WordComponent, MatCardModule],
    standalone: true,
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
