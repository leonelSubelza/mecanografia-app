import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppStateService } from '@/pages/game/services/app-state.service';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { GeneralStatsService, SprintModeHandlerService } from '@/services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameMode } from '@/interfaces/entities';

@Component({
  selector: 'app-typing-display',
  imports: [MatCardModule, NgClass, MatButtonModule, MatTooltipModule],
  standalone: true,
  templateUrl: './typing-display.component.html',
  styleUrl: './typing-display.component.css',
})
export class TypingDisplayComponent implements OnInit {
  _appStateService = inject(AppStateService);
  _sprintModeHandlerService = inject(SprintModeHandlerService);
  _generalStatsService = inject(GeneralStatsService);
  input = input.required<string>();
  currentWord = input<string>();
  onInput = output<string>();

  isMobile = signal<boolean>(false);

  inputEvaluated = signal<string>('');

  inputStack = signal<string[]>([]);

  showTooltipMessage: boolean = true;

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (window.innerWidth < 1000) {
        this.isMobile.set(true);
      } else {
        this.isMobile.set(false);
      }
      if(!this._sprintModeHandlerService.showStartScreen() && !this._sprintModeHandlerService.gameOver()){
        if(this.isMobile() && this.textareaRef) {
          this.textareaRef.nativeElement.focus();
        }
        if(!this.isMobile() && this.inputRef) {
          this.inputRef.nativeElement.focus();
        }
      }
    });
    7;
  }

  ngOnInit(): void {

  }

  handleInput($event: any) {
    $event.preventDefault();
    this.hideTooltip();
    let key: string = $event.data;

    // On mobile, there was a bug where the keyboard, when typing a word one letter long, executed the letter's input event twice, which generated an error, for example you write "y " and its generated "yy " as events.
    // Therefore, the variable inputEvaluated was created to compare the texts that were already executed so as not to execute the same event twice.
    const textWritten = $event.target.value;
    if (this.inputEvaluated() === '') {
      this.inputEvaluated.set(textWritten);
    } else {
      if (this.inputEvaluated() === textWritten) {
        return;
      }
    }

    // if the input has text, then we handle the delete. This is because of the mobile not recognize the keyboard if the input has text
    // if(key===null&&this._appStateService.valueUserWriting()!=='') {
    if (key === null && this.input() !== '') {
      key = 'Backspace';
    }
    // if the key is null means the user pressed on Backspace button
    // if(key===null&&this._appStateService.valueUserWriting()==='') {
    if (key === null && this.input() === '') {
      return;
    }

    this.inputEvaluated.set(textWritten);
    this.onInput.emit(key);
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault(); // Evita que ocurra la acción de pegar
    alert('no podes pegar pelotudo');
  }

  hideTooltip() {
    this.showTooltipMessage = false;
  }

  isPrecisionModeScreen(): boolean {
    return this._generalStatsService.gameMode() === GameMode.PRECISION_MODE;
  }
}
