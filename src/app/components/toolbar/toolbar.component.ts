import { Component, inject, input, output, signal } from '@angular/core';
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

const ANGULAR_MATERIAL_IMPORTS = [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,MatMenuModule, MatTooltipModule];

@Component({
    selector: 'app-toolbar',
    imports: [ANGULAR_MATERIAL_IMPORTS, RouterLink, NgClass],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  _appStateService = inject(AppStateService);
  _gameHandlerService = inject(GameHandlerService);
  _confirmationDialogService = inject(ConfirmationDialogService);
  _router = inject(Router)

  showButtons = input<boolean>(true);
  onRestartGame = output();
  onStartNewGame = output();

  isLightMode = signal<boolean>(true);

  onMenuItemClick(path: string) {
     this._router.navigateByUrl(path);
  }

  onStartNewGameClick() {
    const data = { message: '¿Está seguro que desea iniciar una nueva partida?'};
    const dialogRef = this._confirmationDialogService.openModal<ConfirmationDialogComponent>(ConfirmationDialogComponent,data);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      switch (result.action) {
        case 'accept':
          // this._gameHandlerService.startNewGame();
          this.onStartNewGame.emit();
          break;
        default:
          break;
      }
    });
  }

  onClickSound(){
    this._appStateService.setIsSoundActive(!this._appStateService.isSoundActive());
  }

  onRefreshClick() {
    this.onRestartGame.emit();
    // this._gameHandlerService.restartGame();
  }

  onChangeTheme() {
    this.isLightMode.set(!this.isLightMode());
    if(!this.isLightMode()){
      document.getElementsByTagName("html")[0].className = 'dark-theme';
      document.getElementsByTagName("html")[0].classList.remove("light-theme");
    }else {
      document.getElementsByTagName("html")[0].className = 'light-theme';
      document.getElementsByTagName("html")[0].classList.remove("dark-theme");
    }
  }
}
