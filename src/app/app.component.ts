import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { GeneralStatsService } from './services';

const ANGULAR_MATERIAL_IMPORTS = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ANGULAR_MATERIAL_IMPORTS],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private generalStatsService = inject(GeneralStatsService);

  ngOnInit(): void {
    const theme = this.generalStatsService.generalStats()?.theme;
    if (theme === 'dark') {
      document.documentElement.className = 'dark-theme';
      this.generalStatsService.setFavicon(false)
    }
  }
}
