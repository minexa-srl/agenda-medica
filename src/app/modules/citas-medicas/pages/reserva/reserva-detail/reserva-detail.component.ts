/* CONTROLLER RESERVA-DETAIL
============================================ */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { Asegurado } from 'src/app/modules/asegurado/models/asegurado';
import { ConsultorioAsegurado } from 'src/app/modules/asegurado/models/consultorio-asegurado';
import { Reservas } from 'src/app/modules/citas-medicas/models/reservas';

import { ReporteService } from '../../../services/reporte.service';

@Component({
  selector: 'app-reserva-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ButtonModule],
  templateUrl: './reserva-detail.component.html',
  styleUrl: './reserva-detail.component.css'
})

export class ReservaDetailComponent {

  /* ATTRIBUTES
  -------------------------*/
  reportPdf!: SafeResourceUrl | null;
  state!: boolean;

  /* METHODS
  -------------------------*/
  constructor(
    private reporteService: ReporteService) {
  }

  async show(asegurado: Asegurado, consultorio: any, reserva: Reservas) {
    console.log('show', asegurado, consultorio, reserva)
    this.state = true;
    const data = {
      'regional': asegurado.ubicacion,
      'centroMedico': asegurado.centroMedico,
      'consultorio': consultorio,
      'paciente': reserva.asegurado.nombres + ' ' + reserva.asegurado.paterno,
      'medico': reserva.medicoUsuario.nombres,
      'fechaReserva': reserva.fechaReserva,
      'ficha': reserva.hora.numero,
      'horaInicio': reserva.hora.inicioDetalle,
      'horaFin': reserva.hora.finDetalle,
      'usuario': asegurado.titular
    }
    this.reportPdf = await this.reporteService.generateReportFicha(data);
    console.log('reportpdf', reserva);

  }

  cancel() {
    this.reportPdf = null;
    this.state = false;
  }
}
