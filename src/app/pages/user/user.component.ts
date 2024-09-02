import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GeneralStatsService } from '../../services/general-stats.service';
import { FormsModule } from '@angular/forms';
import { Stats } from '../../interfaces/entities';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule, MatInputModule, MatSelectModule,MatIconModule,MatButtonModule,FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class UserComponent {
  _generalStatsService = inject(GeneralStatsService);

  readonly username = model(this._generalStatsService.generalStats().username);

  onSave(){
    this._generalStatsService.setUsername(this.username());
    this._generalStatsService.setStatsLocalStorage(this._generalStatsService.generalStats());
  }

  // loadInitialUsername(): string {
  //   const initialStats: Stats = this._generalStatsService.getItem('stats');
  //   return initialStats.username;
  // }
}
