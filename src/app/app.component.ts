import { Component, inject, OnInit } from '@angular/core';
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
    if (
      this.generalStatsService.generalStats() &&
      this.generalStatsService.generalStats().theme === 'dark'
    ) {
      document.getElementsByTagName('html')[0].className = 'dark-theme';
    }
  }
}
