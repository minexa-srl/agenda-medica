/* CONTROLLER RESERVA-LIST
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
import { ConfirmationDeleteComponent } from 'src/app/modules/citas-medicas/components/confirmation-delete/confirmation-delete.component';
import { Reservas } from 'src/app/modules/citas-medicas/models/reservas';
import { CitasMedicasService } from 'src/app/modules/citas-medicas/services/citas-medicas.service';

import { ReservasService } from '../../../services/reservas.service';
import { ReservaDetailComponent } from '../reserva-detail/reserva-detail.component';
import { ConsultoriosService } from 'src/app/modules/asegurado/services/consultorios.service';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [TooltipModule, ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, ReservaDetailComponent, ConfirmationDeleteComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './reserva-list.component.html',
  styleUrl: './reserva-list.component.scss'
})
export class ReservaListComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  @ViewChild(ReservaDetailComponent) detail!: ReservaDetailComponent;
  @ViewChild(ConfirmationDeleteComponent) confimationDelete!: ConfirmationDeleteComponent;
  asegurado!: Asegurado;
  reservasPendientes!: Reservas[];
  consultorio!: ConsultorioAsegurado;

  /* METHODS
  -------------------------*/
  constructor(
    private messageService: MessageService,
    private citasMedicasService: CitasMedicasService,
    private consultorioService: ConsultoriosService,
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
          this.getReservasPendientes();
          this.getConsultorio();
        },
      })
  }

  getReservasPendientes() {
    this.reservaService.getPendientesByAsegurado({ aseguradoId: this.asegurado.aseguradoId, estadoReservaId: 1 })
      .subscribe({
        next: response => {
          this.reservasPendientes = response
          console.log('RESPONSE->getReservasPendientes ', response);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'No se pudo obtener las Reservas Pendientes.' });
          console.log('ERROR->getReservasPendientes:', error.error);
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

  showReport(reserva: any) {
    this.consultorioService.getConsultorios(this.asegurado.centroMedicoId).subscribe({
      next: response => {
        const consultorios = response;
        const consultorio = consultorios.find(c => c.id == reserva.consultorioHorario.consultorioId);
        this.detail.show(this.asegurado, consultorio, reserva);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Consultorio Consulta Externa, no obtenido.' });
        console.log('ERROR->getConsultorioConsultaExterna: ', error.error);
      }
    })

  }

  showConfirmationDelete(id: number) {
    this.confimationDelete.show(id);
  }

  delete(id: string) {
    this.reservaService.delete(id).subscribe({
      next: (response) => {
        this.getReservasPendientes();
        console.log('RESPONSE->delete', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->delete Error en:', error.error);
      }
    });
  }
}
