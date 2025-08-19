import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit() {
  }

}
