import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Letter } from '../../../interfaces/entities';
import { GameHandlerService } from '../../../services/game.handler.service';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent implements OnInit {
  letter = input.required<Letter>();
  isLetterActive = input<boolean>(false);
  index? = input<number>();

  _gameHandlerService = inject(GameHandlerService);

  constructor(){}

  ngOnInit(): void {

  }
}
