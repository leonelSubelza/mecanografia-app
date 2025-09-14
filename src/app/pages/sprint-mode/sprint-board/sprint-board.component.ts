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
export class SprintBoardComponent {
  _sprintModeHandlerService = inject(SprintModeHandlerService);

  isMobile = signal<boolean>(false);

  constructor() { }

  getLetterStatus(letter: Letter) {
    return letter.status
  }
}
