import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent {
  @Input() letter?: string;
  @Input() isLetterActive: boolean = false;
  @Input() index?: number;
}
