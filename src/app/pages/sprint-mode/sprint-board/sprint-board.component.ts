import { Component, inject, OnInit, signal } from '@angular/core';
import { SprintModeHandlerService } from '../../../services/sprint-mode.handler.service';
import { NgClass } from '@angular/common';
import { SprintModeBoardHandlerService } from '../sprint-mode-board.handler.service';
import { Letter } from '../../../interfaces/entities';

@Component({
  selector: 'app-sprint-board',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sprint-board.component.html',
  styleUrl: './sprint-board.component.css'
})
export class SprintBoardComponent implements OnInit {
  _sprintModeHandlerService = inject(SprintModeHandlerService);
  // _sprintModeBoardHandlerService = inject(SprintModeBoardHandlerService);

  isMobile = signal<boolean>(false);
  // textAux = '';



  constructor() { }

  ngOnInit(): void {
    // Initialization logic for the sprint board can go here
  }  

  getLetterStatus(letter: Letter) {
    return letter.status
  }
}
