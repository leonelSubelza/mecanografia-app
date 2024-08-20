import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { GameHandlerService } from '../../services/game.handler.service';
import { Letter, LetterStatus, TextContent, Word } from '../../interfaces/entities';
import { texts } from '../../shared/mock/texts.mock';
import { TypingDisplayComponent } from "./components/typing-display/typing-display.component";
import { BoardComponent } from "./components/board/board.component";
import { WordComponent } from './components/board/word/word.component';
import { GameInfoComponent } from "./components/game-info/game-info.component";
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [WordComponent, TypingDisplayComponent, BoardComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);

  constructor() {}

  ngOnInit(): void {
    this.startNewGame();
  }


  startNewGame() {
    this.setRandomWord();
    this._appStateService.setActualLetterIsActive(true);
    // this._gameHandlerService.updateActualWord(0);
    // this._gameHandlerService.updateActualLetter(0);
    this._appStateService.setActualWordIsActive(true);
    this._gameHandlerService.updateCorrectLetter()
  }

  setRandomWord() {
    const indexRandomText: number = Math.floor(Math.random() * texts.length);
    const randomText: TextContent = texts[indexRandomText];

    this._gameHandlerService.generateBoard(randomText.text);
    // this._gameHandlerService.generateBoard('aaaaaa bbbbb aaa aaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaaaaaaaa bbbbb aaa');
    this._appStateService.setTextContent(randomText);

    this._appStateService.setIndexWordActive(0);
    this._appStateService.setIndexLetterActive(0);
  }

}
