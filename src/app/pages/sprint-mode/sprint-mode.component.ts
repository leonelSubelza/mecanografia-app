import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SprintModeHandlerService } from '@/pages/sprint-mode/services/sprint-mode.handler.service';
import { SprintBoardComponent } from './sprint-board/sprint-board.component';
import { SprintModeBoardHandlerService } from './sprint-mode-board.handler.service';
import { FormsModule } from '@angular/forms';
import { GameTimerService, GeneralStatsService } from '@/services';
import { ToolbarComponent, TypingDisplayComponent } from '@/components';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const ANGULAR_MATERIAL_IMPORTS = [
  MatCardModule,
  MatButtonModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule,
];

@Component({
  selector: 'app-sprint-mode',
  imports: [
    ANGULAR_MATERIAL_IMPORTS,
    SprintBoardComponent,
    FormsModule,
    TypingDisplayComponent,
    ToolbarComponent,
    NgClass,
  ],
  standalone: true,
  templateUrl: './sprint-mode.component.html',
  styleUrl: './sprint-mode.component.css',
})
export class SprintModeComponent implements OnInit {
  _sprintModeHandlerService = inject(SprintModeHandlerService);
  _sprintModeBoardHandlerService = inject(SprintModeBoardHandlerService);
  _generalStatsService = inject(GeneralStatsService);

  _timerService = inject(GameTimerService);

  inputElement = viewChild<HTMLInputElement>('inputRef');
  timeLeftPercent = signal<number>(100);
  
  isMobile = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (window.innerWidth < 1000) {
        this.isMobile.set(true);
      } else {
        this.isMobile.set(false);
      }
      if(this._timerService.countdownTimeMillisRemaining()) {
        // ASUMIMOS QUE SIEMPRE SE TENDRÁ 30seg (30000) como total
        /**30000---100 
         * 2500
        */
        this.timeLeftPercent.set(Math.round(this._timerService.countdownTimeMillisRemaining()*100/30000));
      }
      
    });
  }

  ngOnInit(): void {
    this._sprintModeHandlerService.resetValues();
    this._sprintModeHandlerService.startNewGameSprintMode();
  }

  handleInputWritten($event: string) {
    // console.log("key pulsada en modo sprint:" + $event);
    this._sprintModeBoardHandlerService.handleLetterWritten($event);
  }
  handleRestartGame() {
    this._sprintModeHandlerService.restartGameAndStartPlaying();
  }
  handleNewGame() {
    this._sprintModeHandlerService.restartGameAndGoToStartScreen();
  }
}
