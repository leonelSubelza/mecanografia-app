import { Component, OnInit, inject, input } from '@angular/core';
import { LetterComponent } from './letter/letter.component';
import { GameHandlerService } from '@game-mode/game.handler.service';
import { Word } from '@/interfaces/entities';
import { NgClass } from '@angular/common';
import { AppStateService } from '@/pages/game/services/app-state.service';

@Component({
  selector: 'app-word',
  imports: [LetterComponent, NgClass],
  standalone: true,
  template: `
    <div
      class="word-container"
      id="{{ this.word().id }}"
      [ngClass]="{ active: this.word().isActive }"
    >
      @for (letter of this.word().letterList; track $index) {
      <app-letter [letter]="letter" />
      }
    </div>
  `,
  styles: `
    .word-container {
    display: flex;
    flex-wrap: wrap;
}`,
})
export class WordComponent implements OnInit {
  index = input.required<number>();
  word = input.required<Word>();

  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  constructor() {}

  // execute after the constructor function
  ngOnInit(): void {}
}
