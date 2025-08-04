import { Component, inject, output, signal } from '@angular/core';
import { Key, keys } from './keys.mock';
// import { BoardHandlerService } from '../board/board-handler.service';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css',
})
// Al final este componente no se usa, pero lo dejo por si en el futuro se quiere implementar un teclado virtual
export class KeyboardComponent {
  // _boardHandlerService = inject(BoardHandlerService);
  onKeyClick = output<string>();

  keyboardKeys = signal<Key[][]>(keys);
  // isSymbolsActive = signal<boolean>(false);
  isUppercase = signal<boolean>(true);


  handleKeyClick($event: any, key: Key) {
    $event.preventDefault();

    console.log('teclado presionado', key.values[key.values.length - 1]);

    if (key.type === 'button') {
      if (key.values[0] === 'BLOQ MAYÚS') {
        this.switchKeysToCapitalized();
        return;
      }
      if (key.values[0] === 'Symb') {
        this.switchFirstValueOfKeys();
        return;
      }
      if(key.values[0] === 'SPACE') {
        // this._boardHandlerService.handleLetterWritten(' ');
        this.onKeyClick.emit(" ");
        return;
      }
    }

    this.onKeyClick.emit(key.values[key.values.length - 1]);
    // this._boardHandlerService.handleLetterWritten(
    //   key.values[key.values.length - 1]
    // );
  }

  switchFirstValueOfKeys() {
    this.keyboardKeys().forEach((row: Key[]) => {
      row.forEach((key: Key) => (key.values = key.values.reverse()));
    });
    // this.isSymbolsActive.set(!this.isSymbolsActive());
  }

  switchKeysToCapitalized() {
    // if( this.isSymbolsActive()) return;
    this.keyboardKeys().forEach((row: Key[]) => {
      row.forEach(
        (key: Key) => {
          if(key.type !== 'button') {
            if(this.isUppercase()) {
              key.values = key.values.map((value) => value.toLowerCase())
            }else {
              key.values = key.values.map((value) => value.toUpperCase())
            }
          }
        }
      );
    });
    this.isUppercase.set(!this.isUppercase());
  }
}
