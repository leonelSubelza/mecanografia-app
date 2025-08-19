import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { GameOverlayDialogService } from './game-overlay-dialog.service';

const MATERIAL_MODULES = [MatDialogModule, MatButtonModule, MatIconModule]

@Component({
    selector: 'app-modal',
    imports: [MATERIAL_MODULES, NgClass],
    standalone: true,
    templateUrl: './game-overlay-dialog.component.html',
    styleUrl: './game-overlay-dialog.component.css'
})
export class GameOverlayDialogComponent implements OnInit {
  _modalService = inject(GameOverlayDialogService);

  private readonly _modalData = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<GameOverlayDialogComponent>);
  // _gameTimerService = inject(GameTimerService);
  // _appStateService = inject(AppStateService);
  // _gameHandlerService = inject(GameHandlerService);
  // _cpmService = inject(CpmService);

  modalTitle = signal<string>(this._modalData.title);
  isNewRecord = signal<boolean>(this._modalData.isNewRecord);

  textTitle = signal<string>(this._modalData.textTitle);
  accuracy = signal<string>(this._modalData.accuracy);
  totalTime = signal<string>(this._modalData.totalTime);
  cpmValue = signal<string>(this._modalData.cpmValue);


  /**
   *     <p>Texto: {{this._appStateService.textContent().title}}</p>
    <p>Precisión: {{this._appStateService.userAccuracy()}}%</p>
    <p>Tiempo: {{this._gameTimerService.userTime()}}</p>
    <!-- <p>Pulsaciones totales: {{this._cpmService.characterCount()}}</p> -->
    <p>Velocidad: {{this._cpmService.cpm()}}PPM</p>
   * 
   */

  

  // modalTitle: string = '';
  // isNewRecord!: boolean;

  ngOnInit(): void {
    // this.modalTitle = this._matDialog.title;
    // this.isNewRecord = this._matDialog.isNewRecord;
    // if (this._matDialog.isNewRecord) {
    // }
  }

  // posiblemente borrar
  // closeModal() {
    // this._modalService.closeModal();
    // this.dialogRef.close();
  // }

  newGame() {
    this._modalService.closeModal();
    this.dialogRef.close({ action: 'newGame' });
    // this.onNewGame.emit();
    // this._gameHandlerService.startNewGame();
  }

  resetGame() {
    this._modalService.closeModal();
    this.dialogRef.close({ action: 'resetGame' });
    // this.onResetwGame.emit();
    // this._gameHandlerService.restartGame();
  }
}
