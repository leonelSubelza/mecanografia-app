import { Component } from '@angular/core';
import { Key, keys } from './keys.mock';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css'
})

export class KeyboardComponent {

  keyboardKeys: Key[][] = keys;
}
