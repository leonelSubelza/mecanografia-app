import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { GameHandlerService } from '../../../services/game.handler.service';
import { LetterComponent } from './letter/letter.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [NgClass, LetterComponent,NgFor],
  templateUrl: './word.component.html',
  styleUrl: './word.component.css'
})
export class WordComponent implements OnInit, OnDestroy{

  @Input() word?: string;
  @Input() wordIndex?: number;
  @Input() isWordActive: boolean = false;

  wordSplit: string[]|undefined = [];
  indexLetterActive?: number;
  indexWordActive?: number;

  private _gameHandlerService = inject(GameHandlerService);
  // private subscription?: Subscription;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.wordSplit = this.word?.split('');

    // this.subscription = this._gameHandlerService.indexLetterActive$.subscribe(index => {
    //   this.indexLetterActive = index;
    // });
    this.subscriptions.add(
      this._gameHandlerService.indexLetterActive$.subscribe(index => {
        this.indexLetterActive = index;
      })
    );
    this.subscriptions.add(
      this._gameHandlerService.indexWordActive$.subscribe(index => {
        this.indexWordActive = index;
      })
    );
  }

  ngOnDestroy() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    this.subscriptions.unsubscribe();
  }
}
