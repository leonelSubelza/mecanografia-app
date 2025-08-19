import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Letter } from '@/interfaces/entities';
import { SprintModeHandlerService } from '@/services';

@Component({
    selector: 'app-sprint-board',
    imports: [NgClass],
    standalone: true,
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
