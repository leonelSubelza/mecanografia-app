import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GeneralStatsService } from '../../services/general-stats.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  _generalStatsService = inject(GeneralStatsService);
}
