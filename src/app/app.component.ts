import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './pages/game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mecanografia-app';
}
