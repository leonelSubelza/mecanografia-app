import { inject, Injectable } from '@angular/core';
import { SprintModeHandlerService } from '@/pages/sprint-mode/services/sprint-mode.handler.service';
import { Letter, LetterStatus } from '@/interfaces/entities';

@Injectable({
  providedIn: 'root',
})
export class SprintModeBoardHandlerService {
  _sprintModeHandlerService = inject(SprintModeHandlerService);

  constructor() {}

  isAValidWord(key: string): boolean {
    const regexString: string = `^[a-zA-Z0-9\\s.,;:?!'"()\\-áéíóúÁÉÍÓÚñÑüÜ]$`;
    const regex: RegExp = new RegExp(regexString);
    return regex.test(key) || key === ' ';
  }

  handleLetterWritten(key: string) {
    // if (this._appStateService.gameOver()){
    //   this._gameTimerService.stopGameTimer()
    //   return;
    // }

    // console.log(
    //   'index actual letter: ' +
    //     this._sprintModeHandlerService.indexActualLetter()
    // );
    // console.log(
    //   'index correct letter: ' +
    //     this._sprintModeHandlerService.indexCorrectLetter()
    // );
    // console.log(this._sprintModeHandlerService.wordBoard());

    if (this.isAValidWord(key)) {
      console.log('is valid word');

      // if(this._appStateService.isSoundActive()){
      //   this.playKeyPressedSound();
      // }

      // this.scrollToActualWord();

      // if (!this._sprintModeHandlerService.gameOver()){
      //   this._gameTimerService.startGameTimer();
      //   this._cpmService.startCPM();
      // }

      let updateNewLetter: boolean = false;
      // this._userAccuracyService.addOneTotalLettersWritten();
      // this._cpmService.addCharacterCount();

      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente
      if (this.isActualLetterInLetterRange()) {
        if (this.isCorrectLetter(key)) {
          // console.log("la letra es correcta");
          this.setActualLetterStatus(LetterStatus.CORRECT);
          // this._userAccuracyService.addOneCorrectLetter();

          updateNewLetter = true;
        } else {
          this.setActualLetterStatus(LetterStatus.INCORRECT);
        }
      }

      if (this.isWordCompleted()) {
        console.log("PASAR A LA SIGUIENTE PALABRA!!!!!!!!");
        return;
      }
      this.moveNextLetter();
      if (updateNewLetter) {
        this.updateActualLetterAsCorrectLetter();
      }

      this._sprintModeHandlerService.valueUserWritingSprintMode.set(this._sprintModeHandlerService.valueUserWritingSprintMode()+key);
    }
    if (key === 'Backspace') {
      // this._cpmService.addCharacterCount();
      if (this._sprintModeHandlerService.indexActualLetter() === 0) {
        return;
      }
      this.movePrevLetter();
      if(this._sprintModeHandlerService.indexActualLetter() <= this._sprintModeHandlerService.wordBoard().length){
        let statePrevLetter = this.getPrevLetter().status;
        if (statePrevLetter === LetterStatus.CORRECT||this._sprintModeHandlerService.indexActualLetter()===0) {
          this.updateActualLetterAsCorrectLetter();
        }
        // this.scrollToActualWord();
      }

      // we erase the last letter of the value user
      if (
        this._sprintModeHandlerService.valueUserWritingSprintMode().length > 0
      ) {
        // console.log('se borra');

        const valueUserWithoutLastCharacter = this._sprintModeHandlerService
          .valueUserWritingSprintMode()
          .slice(0, -1);
        this._sprintModeHandlerService.valueUserWritingSprintMode.set(valueUserWithoutLastCharacter);
      }
    }
    // console.log('nuevos datos:');
    // console.log(
    //   'NUEVO INDEX LETRA ACTUAL: ' +
    //     this._sprintModeHandlerService.indexActualLetter()
    // );
    // console.log(
    //   'NUEVO INDEX LETRA CORRECTA: ' +
    //     this._sprintModeHandlerService.indexCorrectLetter()
    // );
    // console.log('---------------------------');
  }

  // UTILS FUNCTIONS

  isCorrectLetter(key: string): boolean {
    const indexCorrectLetter =
      this._sprintModeHandlerService.indexCorrectLetter();
    return this._sprintModeHandlerService.wordBoard()[indexCorrectLetter].letter === key && indexCorrectLetter === this._sprintModeHandlerService.indexActualLetter()
    ;
  }

  setActualLetterStatus(status: LetterStatus) {
    const indexActualLetter =
      this._sprintModeHandlerService.indexActualLetter();
    this._sprintModeHandlerService.wordBoard()[indexActualLetter].status =
      status;
  }

  getActualLetter(): Letter {
    const indexActualLetter =
      this._sprintModeHandlerService.indexActualLetter();
    return this._sprintModeHandlerService.wordBoard()[indexActualLetter];
  }

  isLastLetter() {
    const indexActualLetter =
      this._sprintModeHandlerService.indexActualLetter();
    return (
      this._sprintModeHandlerService.wordBoard().length - 1 ===
      indexActualLetter
    );
  }

  moveNextLetter() {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();

    if (indexActualLetter < this._sprintModeHandlerService.wordBoard().length-1) {
      this._sprintModeHandlerService.wordBoard()[indexActualLetter].isActive = false;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter + 1].isActive = true;
      // this._sprintModeHandlerService.indexActualLetter.set(indexActualLetter+1);
    } else {
      console.log('es la última letra');
    }
    this._sprintModeHandlerService.indexActualLetter.set(indexActualLetter + 1);
  }

  movePrevLetter() {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();
    // const indexCorrectLetter = this._sprintModeHandlerService.indexCorrectLetter();

    // solo retrocedemos de forma normal si el indice se encuentra dentro del rango de las letras a escribir
    if (this.isActualLetterInLetterRange()) {
      this._sprintModeHandlerService.wordBoard()[indexActualLetter].isActive = false;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter].status =LetterStatus.DEFAULT;

      this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1].isActive = true;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1].status = LetterStatus.DEFAULT;
    }


    // si se está exactamente en la última letra +1
    if(this._sprintModeHandlerService.indexActualLetter() === this._sprintModeHandlerService.wordBoard().length) {
      this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1].isActive = true;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1].status = LetterStatus.DEFAULT;
    }
    this._sprintModeHandlerService.indexActualLetter.set(indexActualLetter - 1);
  }

  getPrevLetter(): Letter {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();
    if (indexActualLetter === 0)
      return this._sprintModeHandlerService.wordBoard()[indexActualLetter];
    return this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1];
  }

  isActualLetterInLetterRange(): boolean {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();
    return (
      indexActualLetter <= this._sprintModeHandlerService.wordBoard().length-1
    );
  }

  updateActualLetterAsCorrectLetter() {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();
    if (
      indexActualLetter <=
      this._sprintModeHandlerService.wordBoard().length - 1
    ) {
      this._sprintModeHandlerService.indexCorrectLetter.set(indexActualLetter);
    }
  }

  isActualLetterTheLastLetter(): boolean {
    const indexActualLetter = this._sprintModeHandlerService.indexActualLetter();
    const indexCorrectLetter = this._sprintModeHandlerService.indexCorrectLetter();
    return indexActualLetter === this._sprintModeHandlerService.wordBoard().length-1 &&
        indexCorrectLetter === this._sprintModeHandlerService.wordBoard().length-1; 
  }

  isWordCompleted() {
    const indexCorrectLetter = this._sprintModeHandlerService.indexCorrectLetter();
    return this.isActualLetterTheLastLetter() &&
      this._sprintModeHandlerService.wordBoard()[indexCorrectLetter].status === LetterStatus.CORRECT;
  }
}
