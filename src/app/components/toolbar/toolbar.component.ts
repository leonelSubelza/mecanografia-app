import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';
import { NgClass } from '@angular/common';
import { GameHandlerService } from '../../pages/game/game.handler.service';
import { ConfirmationModalService } from './confirmation-modal/confirmation-modal.service';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink,NgClass,MatMenuModule, MatTooltipModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  _appStateService = inject(AppStateService);
  _gameHandlerService = inject(GameHandlerService);
  _confirmationModalService = inject(ConfirmationModalService);
  _router = inject(Router)

  onMenuItemClick(path: string) {
     this._router.navigateByUrl(path);
  }

  onStartNewGame() {
    this._confirmationModalService.openModal<ConfirmationModalComponent>(ConfirmationModalComponent);
  }

  onClickSound(){
    this._appStateService.setIsSoundActive(!this._appStateService.isSoundActive());
  }

  onRefreshClick(){
    this._gameHandlerService.restartGame();
  }
}
