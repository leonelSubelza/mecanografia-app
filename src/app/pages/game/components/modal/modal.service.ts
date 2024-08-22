import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private readonly _dialog = inject(MatDialog);

  constructor() { }

  /* Esta funcion recibe 
  una referencia al componente que contiene al modal (mat-dialog) y si esta todo ok lo muestra, 
  */
  openModal<CT>(componentRef: ComponentType<CT>): void {
    this._dialog.open(componentRef,{
      width: '400px'
    })
    // const config = {data};
    // this._dialog.open(componentRef, {
      // data: config,
      // width: '600px'
    // });
  }

  closeModal(): void {
    this._dialog.closeAll();
  }
}