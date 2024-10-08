import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './pages/game/game.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mecanografia-app';
}
