import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GeneralStatsService } from '@/services/general-stats.service';
import { FormsModule } from '@angular/forms';
import { SnackBarService } from '@/services/snack-bar.service';
import { ToolbarComponent } from '@/components';

@Component({
    selector: 'app-user',
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, FormsModule, ToolbarComponent],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {
  _generalStatsService = inject(GeneralStatsService);
  _snackBarService = inject(SnackBarService);

  username = model(this._generalStatsService.generalStats().username);

  constructor() {
    effect(() => {
      this.username.set(this._generalStatsService.generalStats().username);
    },{ allowSignalWrites: true })
  }

  onSave(){
    this._generalStatsService.generalStats().username = this.username();
    this._generalStatsService.setStats(this._generalStatsService.generalStats());

    this._snackBarService.showSnackBar('Nombre guardado!')
  }

  // loadInitialUsername(): string {
  //   const initialStats: Stats = this._generalStatsService.getItem('stats');
  //   return initialStats.username;
  // }
}
