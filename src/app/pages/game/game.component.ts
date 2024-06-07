import { Component, HostListener, OnInit, inject } from '@angular/core';
import { TextGenerationAPIService } from '../../services/text-generation-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{
  text: string = '';

  wordsLists: string[] = [];

  private _apiService = inject(TextGenerationAPIService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.setRandomWord();

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const {key} = event;
    // console.log(`Key pressed: "${key}"`);

    if(this.isAValidWord(key)){
      // console.log("key valida");
    }
  }

  isAValidWord(key: string): boolean {
    const regexString: string = `^[a-zA-Z0-9\s.,;:?!'"()-]$`;
    const regex: RegExp = new RegExp(regexString);
    return regex.test(key) || key === ' ';
  }

  generateBoard() {
    // this.text.split("").forEach(w => {

    // })
    this.wordsLists = this.text.split('');
  }

  setRandomWord() {
    // this._apiService.getRandomWord(1, 5).subscribe((data: any) => {
    //   console.log(data);
    //   this.text=data.text;
    // });
    this.text='Red Dead Redemption 2 es un videojuego de acción-aventura de mundo abierto desarrollado y publicado por Rockstar Games. El juego es la tercera entrada de la serie Red Dead y una precuela del juego de 2010 Red Dead Redemption.'
    this.generateBoard();
  }


}
