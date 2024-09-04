import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { GameTimerService } from '../../../../services/game-timer.service';
import { ModalService } from './modal.service';
import { MatIconModule } from '@angular/material/icon';
import { AppStateService } from '../../../../services/app-state.service';
import { GameHandlerService } from '../../../../services/game.handler.service';
import { NgClass } from '@angular/common';


const MATERIAL_MODULES = [MatLabel, MatInput, MatFormField, MatDialogModule, MatButtonModule, MatIconModule]

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MATERIAL_MODULES, NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  _modalService = inject(ModalService);
  _gameTimerService = inject(GameTimerService);
  _appStateService = inject(AppStateService);
  _gameHandlerService = inject(GameHandlerService);

  private readonly _matDialog = inject(MAT_DIALOG_DATA);

  modalTitle: string = '';
  isNewRecord!: boolean;

  ngOnInit(): void {
    this.modalTitle = this._matDialog.title;
    this.isNewRecord = this._matDialog.isNewRecord;
    // if (this._matDialog.isNewRecord) {
    // }
  }

  closeModal() {
    this._modalService.closeModal();
  }

  newGame() {
    this._gameHandlerService.startNewGame();
    this._modalService.closeModal();
  }

  resetGame() {
    this._gameHandlerService.restartGame();
    this._modalService.closeModal();
  }
}
