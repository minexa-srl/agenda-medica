/* CONTROLLER CONFIRMATION
============================================= */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';

import { GrupoFamiliar } from 'src/app/modules/asegurado/models/grupo-familiar';

import { Hora } from '../../models/hora';
import { MedicoConsultorio } from '../../models/medico-consultorio';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule, TreeTableModule, ButtonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {

  /* ATTRIBUTES
  ---------------------- */
  @Output() response = new EventEmitter();
  consultorio!: any;
  beneficiario!: GrupoFamiliar | null;
  hora!: Hora;
  fecha!: Date;
  medico!: MedicoConsultorio;
  state!: boolean;

  /* METHODS
  ---------------------- */
  show(medico: MedicoConsultorio, fecha: Date, hora: Hora, beneficiario: GrupoFamiliar | null, consultorio: any) {
    this.consultorio = consultorio;
    this.medico = medico;
    this.fecha = fecha;
    this.beneficiario = beneficiario;
    this.hora = hora;
    this.state = true;
  }

  aceptar() {
    this.state = false;
    this.response.emit();
  }

  cancel() {
    this.state = false;
  }

}
