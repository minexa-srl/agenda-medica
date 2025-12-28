/* CONTROLLER CONFIRMATION
======================================= */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-confirmation-delete',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './confirmation-delete.component.html',
  styleUrl: './confirmation-delete.component.scss',
})

export class ConfirmationDeleteComponent {

  /* ATTRIBUTES
  -------------------------*/
  @Output() response = new EventEmitter();
  msg!: Mensaje;
  id!: number;
  state!: boolean;

  /* METHODS
  -------------------------*/
  show(id: number) {
    this.id = id;
    this.msg = {
      'icono': 'pi pi-times-circle',
      'titulo': 'Anular Cita Médica',
      'contenido': 'Señor Usuario, está serguro de Anular esta Cita Médica ...? Si elige aceptar, se anulará la Cita Médica.'
    };
    this.state = true;
  }

  aceptar() {
    this.response.emit(this.id);
    this.state = false;
  }

  cancel() {
    this.state = false;
  }
}
