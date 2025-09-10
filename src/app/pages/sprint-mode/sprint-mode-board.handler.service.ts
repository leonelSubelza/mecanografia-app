import { inject, Injectable } from '@angular/core';
import { SprintModeHandlerService } from '@/pages/sprint-mode/services/sprint-mode.handler.service';
import { Letter, LetterStatus } from '@/interfaces/entities';
import { CpmService, GameTimerService, GeneralStatsService } from '@/services';

@Injectable({
  providedIn: 'root',
})
export class SprintModeBoardHandlerService {
  private _generalStatsService = inject(GeneralStatsService);
  private _sprintModeHandlerService = inject(SprintModeHandlerService);
  private _timerService = inject(GameTimerService);
  private _cpmService = inject(CpmService);

  constructor() {}

  isAValidWord(key: string): boolean {
    const regexString: string = `^[a-zA-Z0-9\\s.,;:?!'"()\\-áéíóúÁÉÍÓÚñÑüÜ]$`;
    const regex: RegExp = new RegExp(regexString);
    return regex.test(key) || key === ' ';
  }

  handleLetterWritten(key: string) {
    if (this._sprintModeHandlerService.gameOver()) {
      this._timerService.stopGameTimer();
      return;
    }

    if(key != 'Backspace')  key = key.toLocaleLowerCase();
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
      if (this._generalStatsService.generalStats().sound) {
        this.playKeyPressedSound();
      }

      // this.scrollToActualWord();

      // ESTO INICIA EL JUEGO
      // if (!this._sprintModeHandlerService.gameOver()) {
      //   this._timerService.startCountDownGameTimer();
      //   this._cpmService.startCPM();
      // }

      let updateNewLetter: boolean = false;
      // this._userAccuracyService.addOneTotalLettersWritten();
      this._cpmService.addCharacterCount();

      // Si la letra activa es igual a la letra pulsada se pasa a la siguiente
      if (this.isActualLetterInLetterRange()) {
        if (this.isCorrectLetter(key)) {
          // console.log("la letra es correcta");
          this.setActualLetterStatus(LetterStatus.CORRECT);
          // this._userAccuracyService.addOneCorrectLetter();

          updateNewLetter = true;
        } else {
          if (this._generalStatsService.generalStats().sound)
            this.playErrorSound();
          this.setActualLetterStatus(LetterStatus.INCORRECT);
          this._sprintModeHandlerService.isPerfectScore.set(false);
        }
      }

      if (this.isWordCompleted()) {
        this._sprintModeHandlerService.loadNewWord();
        if(this._generalStatsService.generalStats().sound) new Audio('sounds/sprint-mode/ding.wav').play();
        return;
      }
      this.moveNextLetter();
      if (updateNewLetter) {
        this.updateActualLetterAsCorrectLetter();
      }

      this._sprintModeHandlerService.valueUserWritingSprintMode.set(
        this._sprintModeHandlerService.valueUserWritingSprintMode() + key
      );
    }
    if (key === 'Backspace') {
      this._cpmService.addCharacterCount();
      if (this._sprintModeHandlerService.indexActualLetter() === 0) {
        return;
      }
      this.movePrevLetter();
      if (
        this._sprintModeHandlerService.indexActualLetter() <=
        this._sprintModeHandlerService.wordBoard().length
      ) {
        let statePrevLetter = this.getPrevLetter().status;
        if (
          statePrevLetter === LetterStatus.CORRECT ||
          this._sprintModeHandlerService.indexActualLetter() === 0
        ) {
          this.updateActualLetterAsCorrectLetter();
        }
        // this.scrollToActualWord();
      }

      // we erase the last letter of the value user
      if (
        this._sprintModeHandlerService.valueUserWritingSprintMode().length > 0
      ) {
        // console.log('se borra');

        // console.log("texto para borrar ult letra: "+this._sprintModeHandlerService.valueUserWritingSprintMode());

        const valueUserWithoutLastCharacter = this._sprintModeHandlerService
          .valueUserWritingSprintMode()
          .slice(0, -1);
        this._sprintModeHandlerService.valueUserWritingSprintMode.set(
          valueUserWithoutLastCharacter
        );
        // console.log("texto sin ult letra: "+this._sprintModeHandlerService.valueUserWritingSprintMode());
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
    return (
      this._sprintModeHandlerService.wordBoard()[indexCorrectLetter].letter ===
        key &&
      indexCorrectLetter === this._sprintModeHandlerService.indexActualLetter()
    );
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

  // isLastLetter() {
  //   const indexActualLetter =
  //     this._sprintModeHandlerService.indexActualLetter();
  //   return (
  //     this._sprintModeHandlerService.wordBoard().length - 1 ===
  //     indexActualLetter
  //   );
  // }

  moveNextLetter() {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();

    if (
      indexActualLetter <
      this._sprintModeHandlerService.wordBoard().length - 1
    ) {
      this._sprintModeHandlerService.wordBoard()[indexActualLetter].isActive =
        false;
      this._sprintModeHandlerService.wordBoard()[
        indexActualLetter + 1
      ].isActive = true;
      // this._sprintModeHandlerService.indexActualLetter.set(indexActualLetter+1);
    } else {
      // console.log('es la última letra');
    }
    this._sprintModeHandlerService.indexActualLetter.set(indexActualLetter + 1);
  }

  movePrevLetter() {
    let indexActualLetter = this._sprintModeHandlerService.indexActualLetter();
    // const indexCorrectLetter = this._sprintModeHandlerService.indexCorrectLetter();

    // solo retrocedemos de forma normal si el indice se encuentra dentro del rango de las letras a escribir
    if (this.isActualLetterInLetterRange()) {
      this._sprintModeHandlerService.wordBoard()[indexActualLetter].isActive =
        false;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter].status =
        LetterStatus.DEFAULT;

      this._sprintModeHandlerService.wordBoard()[
        indexActualLetter - 1
      ].isActive = true;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1].status =
        LetterStatus.DEFAULT;
    }

    // si se está exactamente en la última letra +1
    if (
      this._sprintModeHandlerService.indexActualLetter() ===
      this._sprintModeHandlerService.wordBoard().length
    ) {
      this._sprintModeHandlerService.wordBoard()[
        indexActualLetter - 1
      ].isActive = true;
      this._sprintModeHandlerService.wordBoard()[indexActualLetter - 1].status =
        LetterStatus.DEFAULT;
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
      indexActualLetter <= this._sprintModeHandlerService.wordBoard().length - 1
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
    const indexActualLetter =
      this._sprintModeHandlerService.indexActualLetter();
    const indexCorrectLetter =
      this._sprintModeHandlerService.indexCorrectLetter();
    return (
      indexActualLetter ===
        this._sprintModeHandlerService.wordBoard().length - 1 &&
      indexCorrectLetter ===
        this._sprintModeHandlerService.wordBoard().length - 1
    );
  }

  isWordCompleted() {
    const indexCorrectLetter =
      this._sprintModeHandlerService.indexCorrectLetter();
    return (
      this.isActualLetterTheLastLetter() &&
      this._sprintModeHandlerService.wordBoard()[indexCorrectLetter].status ===
        LetterStatus.CORRECT
    );
  }

  private errorAudio = new Audio('sounds/sprint-mode/error.wav');

  playErrorSound() {
    // si ya está sonando, no hacer nada
    // if (!this.errorAudio.paused && !this.errorAudio.ended) {
    //   return;
    // }

    // volver a la posición inicial por si terminó
    this.errorAudio.currentTime = 0;
    this.errorAudio.play();
  }

  playKeyPressedSound() {
    const audios = [
      new Audio('sounds/sprint-mode/type1.wav'),
      new Audio('sounds/sprint-mode/type2.wav'),
      new Audio('sounds/sprint-mode/type3.wav'),
    ];

    let indexRandomWord: number = Math.floor(Math.random() * audios.length);
    audios[indexRandomWord].play();
  }
}
