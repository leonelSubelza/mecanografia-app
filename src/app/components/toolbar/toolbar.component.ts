import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';
import { NgClass } from '@angular/common';
import { GameHandlerService } from '../../services/game.handler.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, ToolbarComponent,RouterLink,NgClass],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  _appStateService = inject(AppStateService);
  _gameHandlerService = inject(GameHandlerService);

  onClickSound(){
    this._appStateService.setIsSoundActive(!this._appStateService.isSoundActive());
  }

  onRefreshClick(){
    this._gameHandlerService.restartGame();
  }
}
