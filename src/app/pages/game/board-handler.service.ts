import { ElementRef, inject, Injectable, ViewChild, viewChild } from '@angular/core';
import { GameHandlerService } from '../../services/game.handler.service';
import { AppStateService } from '../../services/app-state.service';
import { GameTimerService } from '../../services/game-timer.service';
import { UserAccuracyService } from '../../services/user-accuracy.service';
import { LetterStatus, Word } from '../../interfaces/entities';

@Injectable({
  providedIn: 'root'
})
export class BoardHandlerService {
  _gameHandlerService = inject(GameHandlerService);
  _appStateService = inject(AppStateService);
  _gameTimerService = inject(GameTimerService);
  _userAccuracyService = inject(UserAccuracyService);


  constructor() { }

  handleLetterWritten(key: string){
    if (this._appStateService.gameOver()){
      this._gameTimerService.stopGameTimer()
      return;
    }
    // const { key } = event;
    if (this._gameHandlerService.isAValidWord(key)) {
      if (!this._appStateService.gameOver()){
        this._gameTimerService.startGameTimer();
      }
      let updateNewLetter: boolean = false;
      this._userAccuracyService.addOneTotalLettersWritten();
      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente
      if (this._gameHandlerService.isCorrectLetter(key)) {
        // console.log("la letra es correcta");
        this._appStateService.setActualLetterStatus(LetterStatus.CORRECT);
          this._userAccuracyService.addOneCorrectLetter();
          updateNewLetter = true;
        
      } else {
        this._appStateService.setActualLetterStatus(LetterStatus.INCORRECT);
      }
      if(this._gameHandlerService.isLastLetterInTheGame() && this._appStateService.getActualLetter().status !== LetterStatus.CORRECT){
        return;
      }
      this.moveNextLetter();
      if (updateNewLetter && this._appStateService.getActualWord()){
        this._gameHandlerService.updateCorrectLetter();
        this.scrollToActualWord();
      } 

      this._appStateService.setValueUserWriting(this._appStateService.valueUserWriting()+key);
    }
    if (key === "Backspace") {
      if(this._appStateService.indexActualLetter() === 0
      && this._appStateService.indexActualWord() === 0) {
        return;
      }
      let statePrevLetter = this._gameHandlerService.getPrevLetter().status;
      this.movePrevLetter();
      if(statePrevLetter === LetterStatus.CORRECT) {
        this._gameHandlerService.updateCorrectLetter();
        this.scrollToActualWord();
      }
      
      // we erase the last letter of the value user
      if(this._appStateService.valueUserWriting().length>0){
        const valueUserWithoutLastCharacter = this._appStateService.valueUserWriting().slice(0, -1);
        this._appStateService.setValueUserWriting(valueUserWithoutLastCharacter);
      }
    }
  }

  movePrevLetter() {
    // if its the first word and the first letter
    if(this._appStateService.indexActualLetter() === 0
    && this._appStateService.indexActualWord() === 0) {
      return;
    }
    this._appStateService.setActualLetterIsActive(false);
    this._appStateService.setActualLetterStatus(LetterStatus.DEFAULT);

    // if its the first letter of the word
    if (this._appStateService.indexActualLetter() === 0) {
      this.setNextWord(false);
      return;
    }
    this.setNextLetter(false);
  }

  moveNextLetter() {
    this._appStateService.setActualLetterIsActive(false);
    let actualWord: Word = this._appStateService.getActualWord();
    //if its the last letter in the word
    if (this._appStateService.indexActualLetter() === actualWord.word.length - 1) {
      //if it is the last word in the game
      if (this._gameHandlerService.isGameCompleted()) {
        this._appStateService.setGameOver(true);
        // return;
        // aca le quite el return porque asi se pone el indexActualWord en +1 para actualizar el gamePercent
      }
      //we pass to the next word
      this.setNextWord(true);
      return;
    }
      //we pass to the next LETTER
    this.setNextLetter(true);
  }

  setNextLetter(isNextLetter: boolean) {
    let indexLetterActive = this._appStateService.indexActualLetter();

    if(isNextLetter){
      this._appStateService.setIndexLetterActive(indexLetterActive + 1);
    }else{
      this._appStateService.setIndexLetterActive(indexLetterActive - 1);
    }
    this._appStateService.setActualLetterIsActive(true);
    this._appStateService.setActualLetterStatus(LetterStatus.DEFAULT)
    // this._gameHandlerService.updateActualLetter(this._gameHandlerService.indexLetterActive());
    
  }

  // We know in advance that there is a next or previous letter
  setNextWord(isNextWord: boolean) {
    this._appStateService.setActualWordIsActive(false);

    let actualWordIndex = this._appStateService.indexActualWord();

    if (isNextWord) {
      if(this._gameHandlerService.isWordCompleted()){
        this._appStateService.setWordIsCompleted(true);
      }
      // update the current values one letter forward
      this._appStateService.setIndexWordActive(actualWordIndex + 1);
      this._appStateService.setIndexLetterActive(0);
    } else {
      let auxActualIndex = this._appStateService.indexActualLetter();
      // update the current values one letter back
      this._appStateService.setIndexWordActive(actualWordIndex - 1);
      let newActualWord =
        this._appStateService.board()[this._appStateService.indexActualWord()];
      this._appStateService.setIndexLetterActive(newActualWord.word.length - 1);
      
      // if it's the first letter of a word and we are stepping one letter back, we change status of the prev word
      if (auxActualIndex === 0) {
        this._appStateService.setWordIsCompleted(false);
      }
    }
    // stablish de default value for the new Letter and Word
    if(this._appStateService.getActualWord()){
      this._appStateService.setActualLetterStatus(LetterStatus.DEFAULT)
      this._appStateService.setActualWordIsActive(true);
      this._appStateService.setActualLetterIsActive(true); 
    }
  }

  @ViewChild('words-board') container!: ElementRef<HTMLDivElement>;
  // wordsContainerElement = viewChild<ElementRef<HTMLDivElement>>('words-board');

  scrollToActualWord(){
    let actualWord: Word = this._appStateService.getActualWord();
    const child = document.getElementById(`${actualWord.id}`);
    const container = document.querySelector('.words-board');
    // const containerScroll = document.querySelector('.words-board-scroll');
    
    // console.log(containerScroll);

// if (child && container && containerScroll) {
//   // Calcular la posición del hijo en relación al contenedor
//   const containerTop = containerScroll.getBoundingClientRect().top;
//   const childTop = child.getBoundingClientRect().top;
//   const offset = childTop - containerTop;

//   // Ajustar el scroll del contenedor
//   container.scrollTop += offset;
// }

    if(child&&container
      // &&containerScroll
    ){
      child.scrollIntoView()
    }
  }
}
