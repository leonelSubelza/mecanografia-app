import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { GameOverlayDialogService } from './game-overlay-dialog.service';
import { GeneralStatsService } from '@/services';
import confetti from 'canvas-confetti';

const MATERIAL_MODULES = [MatDialogModule, MatButtonModule, MatIconModule];

@Component({
  selector: 'app-modal',
  imports: [MATERIAL_MODULES, NgClass],
  standalone: true,
  templateUrl: './game-overlay-dialog.component.html',
  styleUrl: './game-overlay-dialog.component.css',
})
export class GameOverlayDialogComponent implements OnInit {
  private _generalStatsService = inject(GeneralStatsService);
  _modalService = inject(GameOverlayDialogService);

  private readonly _modalData = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<GameOverlayDialogComponent>);
  // _gameTimerService = inject(GameTimerService);
  // _appStateService = inject(AppStateService);
  // _gameHandlerService = inject(GameHandlerService);
  // _cpmService = inject(CpmService);

  gameType = signal<'precision' | 'sprint'>(this._modalData.gameType);
  modalTitle = signal<string>(this._modalData.title);
  isNewRecord = signal<boolean>(this._modalData.isNewRecord);

  //normal mode
  textTitle = signal<string>(this._modalData.textTitle);
  accuracy = signal<string>(this._modalData.accuracy);
  totalTime = signal<string>(this._modalData.totalTime);
  cpmValue = signal<string>(this._modalData.cpmValue);

  //sprint-mode
  score = signal<number>(this._modalData.score);

  private confettiInstance: any;

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

  constructor() {
    effect(() => {
      if (
        this.isNewRecord() &&
        this._generalStatsService.generalStats().sound
      ) {
        this.playApplauseSound();
        this.celebrate();
      }
    });
  }

  ngOnInit(): void {
    // this.modalTitle = this._matDialog.title;
    // this.isNewRecord = this._matDialog.isNewRecord;
    // if (this._matDialog.isNewRecord) {
    // }
  }

  ngAfterViewInit() {}

  playApplauseSound() {
    const audio = new Audio('sounds/applauseSound.mp3');
    audio.play();
  }

  celebrate() {
    // Crear el lienzo que cubrirá toda la ventana
    this.confettiInstance = confetti.create(undefined, {
      resize: true, // Asegura que el lienzo se redimensione con la ventana
      useWorker: true, // Opcional: mejora el rendimiento en algunos casos
    });

    const duration = 3000; // en milisegundos
    this.confettiInstance({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.5 }, // Centrado en la pantalla
    });

    // Limpiar el confeti después de cierto tiempo
    setTimeout(() => this.confettiInstance.reset(), duration);
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
