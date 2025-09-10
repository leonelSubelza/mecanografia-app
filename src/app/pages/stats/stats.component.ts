import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GeneralStatsService } from '@/services/general-stats.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogService,
  ToolbarComponent,
} from '@/components';
import { MatButtonModule } from '@angular/material/button';
import { GameMode } from '@/interfaces/entities';

@Component({
  selector: 'app-stats',
  imports: [MatCardModule, ToolbarComponent, MatButtonModule],
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent {
  _generalStatsService = inject(GeneralStatsService);
  _confirmationDialogService = inject(ConfirmationDialogService);

  resetValues(type: GameMode) {
    if (type === GameMode.PRECISION_MODE) {
      this._generalStatsService.generalStats().normalMode = {
        bestTextContent: {
          title: '-',
          text: '-',
          letterCount: 0,
        },
        bestTime: '00:00:00',
        bestAccuracy: 0,
        cpm: 0,
      };
    }
    if (type === GameMode.SPRINT_MODE) {
      this._generalStatsService.generalStats().sprintMode = {
        bestScore: 0,
        totalWordsWritten: 0,
        cpm: 0,
      };
    }
    this._generalStatsService.setStats(
      this._generalStatsService.generalStats()
    );
  }

  onResetValues(type: GameMode) {
    let typeName =
      type === GameMode.PRECISION_MODE ? 'Precision-Mode' : 'Sprint-Mode';
    const data = {
      message:
        '¿Está seguro que desea iniciar reiniciar las estadísticas de ' +
        typeName,
    };
    const dialogRef =
      this._confirmationDialogService.openModal<ConfirmationDialogComponent>(
        ConfirmationDialogComponent,
        data
      );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      switch (result.action) {
        case 'accept':
          this.resetValues(type);
          break;
        default:
          break;
      }
    });
  }

  getGameTypeEnum(value: 'sprint_mode'|'precision_mode'): GameMode {
    if( value === 'precision_mode') {
      return GameMode.PRECISION_MODE;
    }
    return GameMode.SPRINT_MODE;
  }
}
