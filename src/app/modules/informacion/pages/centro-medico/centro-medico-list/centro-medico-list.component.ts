/* CONTROLLER CENTRO-MEDICO-LIST
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

import { UbicacionesService } from 'src/app/modules/asegurado/services/ubicaciones.service';

import { CentroMedico } from '../../../models/centro-medico';
import { Regional } from '../../../models/regional';
import { CentroMedicoService } from '../../../services/centro-medico.service';
import { CentroMedicoDetailComponent } from '../centro-medico-detail/centro-medico-detail.component';

@Component({
  selector: 'app-centro-medico-list',
  standalone: true,
  imports: [TooltipModule, ProgressSpinnerModule, TableModule, DropdownModule, ButtonModule, ToastModule, ConfirmDialogModule, CommonModule, InputTextModule, FormsModule, CentroMedicoDetailComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './centro-medico-list.component.html',
  styleUrl: './centro-medico-list.component.css'
})
export class CentroMedicoListComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  @ViewChild(CentroMedicoDetailComponent) detail!: CentroMedicoDetailComponent;
  regionales!: Regional[];
  centrosMedicos!: CentroMedico[];
  data!: CentroMedico[];

  nivelAtencion = [
    { descripcion: 'Primer Nivel', value: 1 },
    { descripcion: 'Segundo Nivel', value: 2 },
    { descripcion: 'Tercer Nivel', value: 3 },
    { descripcion: 'Cuarto Nivel', value: 4 }
  ];

  /* METHODS
  -------------------------*/
  constructor(
    private messageService: MessageService,
    private ubicacionService: UbicacionesService,
    private centroMedicoService: CentroMedicoService,

  ) {
  }

  ngOnInit() {
    this.getRegionales();
    this.getCentrosMedicos();
  }

  getRegionales() {
    this.ubicacionService.getRegionales({}).subscribe({
      next: response => {
        this.regionales = response
        console.log('RESPONSE->getRegionales', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'No se pudo obtener las Regionales.' });
        console.log('ERROR->getRegionales:', error.error);
      }
    })
  }

  getCentrosMedicos() {
    this.centroMedicoService.getAllCentros().subscribe({
      next: response => {
        this.centrosMedicos = response;
        this.data = response;
        console.log('RESPONSE->getCentrosMedicos', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'No se pudo obtener los Centros Médicos.' });
        console.log('ERROR->getCentrosMedicos:', error.error);
      }
    })
  }

  filter(idRegional: number) {
    this.centrosMedicos = this.data.filter((val) => val.ubicacionRegionalId == idRegional);
  }

  clearFilter() {
    this.centrosMedicos = this.data;
  }

  showDetail(centroMedico: CentroMedico) {
    this.detail.show(centroMedico);
  }

  getNivelAtencion(id: number) {
    return this.nivelAtencion.find(y => y.value == id)?.descripcion;
  }
}
