/* CONTROLLER HISTORIAL-LIST
============================================= */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { AppComponent } from 'src/app/app.component';
import { Asegurado } from 'src/app/modules/asegurado/models/asegurado';
import { ConsultorioAsegurado } from 'src/app/modules/asegurado/models/consultorio-asegurado';
import { Reservas } from 'src/app/modules/citas-medicas/models/reservas';
import { CitasMedicasService } from 'src/app/modules/citas-medicas/services/citas-medicas.service';

import { ReservasService } from '../../../services/reservas.service';
import { HistorialDetailComponent } from '../historial-detail/historial-detail.component';

@Component({
  selector: 'app-historial-list',
  standalone: true,
  imports: [TooltipModule, ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, HistorialDetailComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './historial-list.component.html',
  styleUrl: './historial-list.component.css'
})
export class HistorialListComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  @ViewChild(HistorialDetailComponent) detail!: HistorialDetailComponent;
  asegurado!: Asegurado;
  reservas!: Reservas[];
  consultorio!: ConsultorioAsegurado;

  /* METHODS
  -------------------------*/
  constructor(
    private messageService: MessageService,
    private citasMedicasService: CitasMedicasService,
    private reservaService: ReservasService,
    public app: AppComponent
  ) {
  }

  ngOnInit() {
    this.getDatosAsegurado();
  }

  getDatosAsegurado() {
    this.citasMedicasService
      .getAsegurado(this.app.getUser()?.document ?? '', this.app.getUser()?.birthdate ?? '').subscribe({
        next: response => {
          this.asegurado = response
          console.log('RESPONSE->getAsegurado ', this.asegurado);
        },
        complete: () => {
          this.getAllReservas();
          this.getConsultorio();
        },
      })
  }

  getAllReservas() {
    this.reservaService.getHistorialByAsegurado({ aseguradoId: this.asegurado.aseguradoId }).subscribe({
      next: response => {
        this.reservas = response
        console.log('RESPONSE->getAllReservas ', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'No se pudo obtener las Reservas realizadas por el asegurado.' });
        console.log('ERROR->getAllReservas:', error.error);
      }
    })
  }

  getConsultorio() {
    this.citasMedicasService.getConsultorio(this.asegurado.grupoFamiliarId).subscribe({
      next: response => {
        this.consultorio = response
        console.log('RESPONSE->getConsultorio', this.consultorio);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Consultorio no asignado.' });
        console.log('ERROR->getConsultorio:', error.error);
      }
    })
  }

  showDetail(reserva: Reservas) {
    this.detail.show(this.asegurado, this.consultorio, reserva);
  }
}
