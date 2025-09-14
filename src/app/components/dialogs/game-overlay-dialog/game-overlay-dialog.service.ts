import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GameOverlayDialogService {

  private readonly _dialog = inject(MatDialog);

  constructor() { }

  /* Esta funcion recibe 
  una referencia al componente que contiene al modal (mat-dialog) y si esta todo ok lo muestra, 
  */
  openModal<CT>(componentRef: ComponentType<CT>, data: any): MatDialogRef<CT> {
    // const {title,isNewRecord} = data;
    return this._dialog.open(componentRef,{
      width: '400px',
      data,
    })
  }

  closeModal(): void {
    this._dialog.closeAll();
  }
}