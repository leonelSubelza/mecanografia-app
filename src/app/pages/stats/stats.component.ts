import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GeneralStatsService } from '@/services/general-stats.service';
import { ToolbarComponent } from '@/components';

@Component({
    selector: 'app-stats',
    imports: [MatCardModule, ToolbarComponent],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.css'
})
export class StatsComponent {
  _generalStatsService = inject(GeneralStatsService);
}
