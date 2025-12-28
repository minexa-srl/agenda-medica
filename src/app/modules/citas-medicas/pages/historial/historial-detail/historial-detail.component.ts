/* CONTROLLER HISTORIAL-DETAIL
============================================ */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { Asegurado } from 'src/app/modules/asegurado/models/asegurado';
import { ConsultorioAsegurado } from 'src/app/modules/asegurado/models/consultorio-asegurado';
import { Reservas } from 'src/app/modules/citas-medicas/models/reservas';

@Component({
  selector: 'app-historial-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ButtonModule],
  templateUrl: './historial-detail.component.html',
  styleUrl: './historial-detail.component.css'
})

export class HistorialDetailComponent {

  /* ATTRIBUTES
  -------------------------*/
  asegurado!: Asegurado;
  consultorio!: ConsultorioAsegurado;
  reserva!: Reservas;
  state!: boolean;

  /* METHODS
  -------------------------*/
  show(asegurado: Asegurado, consultorio: ConsultorioAsegurado, reserva: Reservas) {
    this.asegurado = asegurado;
    this.consultorio = consultorio;
    this.reserva = reserva;
    this.state = true;
    console.log(asegurado, consultorio, reserva)
  }

  cancel() {
    this.state = false;
  }
}
