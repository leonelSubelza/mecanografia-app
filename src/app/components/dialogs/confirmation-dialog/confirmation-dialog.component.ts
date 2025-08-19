import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GameHandlerService } from '../../../pages/game/game.handler.service';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@Component({
    selector: 'app-confirmation-modal',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirmation-dialog.component.html',
    styles: ``
})
export class ConfirmationDialogComponent {
  private readonly _modalData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  message = signal<string>(this._modalData.message);

  _confirmationDialogService = inject(ConfirmationDialogService);
  _gameHandlerService = inject(GameHandlerService);

  // private readonly _matDialog = inject(MAT_DIALOG_DATA);

  closeModal() {
    this._confirmationDialogService.closeModal();
  }

  newGame() {
    this._confirmationDialogService.closeModal();
    this.dialogRef.close({ action: 'accept' });
  }
}
