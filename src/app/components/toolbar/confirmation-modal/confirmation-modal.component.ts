import { Component, inject } from '@angular/core';
import { ConfirmationModalService } from './confirmation-modal.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GameHandlerService } from '../../../services/game.handler.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-modal.component.html',
  styles: ``
})
export class ConfirmationModalComponent {
  _confirmationmodalService = inject(ConfirmationModalService);
  _gameHandlerService = inject(GameHandlerService);

  // private readonly _matDialog = inject(MAT_DIALOG_DATA);

  closeModal() {
    this._confirmationmodalService.closeModal();
  }

  newGame() {
    this._gameHandlerService.startNewGame();
    this._confirmationmodalService.closeModal();
  }
}
