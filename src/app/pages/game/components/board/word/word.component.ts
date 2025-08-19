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
    templateUrl: './word.component.html',
    styleUrl: './word.component.css'
})
export class WordComponent implements OnInit{
  index = input.required<number>();
  word = input.required<Word>();

  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  constructor() { }

  // execute after the constructor function
  ngOnInit(): void { }
}
