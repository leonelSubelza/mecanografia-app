import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { GameHandlerService } from '@/pages/game/game.handler.service';
import { ConfirmationDialogComponent, ConfirmationDialogService } from '../dialogs';
import { AppStateService } from '@/services';

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
  _confirmationDialogService = inject(ConfirmationDialogService);
  _router = inject(Router)

  onMenuItemClick(path: string) {
     this._router.navigateByUrl(path);
  }

  onStartNewGame() {
    const data = { message: '¿Está seguro que desea iniciar una nueva partida?'};
    const dialogRef = this._confirmationDialogService.openModal<ConfirmationDialogComponent>(ConfirmationDialogComponent,data);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      switch (result.action) {
        case 'accept':
          this._gameHandlerService.startNewGame();
          break;
        default:
          break;
      }
    });
  }

  onClickSound(){
    this._appStateService.setIsSoundActive(!this._appStateService.isSoundActive());
  }

  onRefreshClick(){
    this._gameHandlerService.restartGame();
  }
}
