/* CONTROLLER RESERVA-FORM
============================================= */
import { CommonModule, DatePipe } from '@angular/common'
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { lastValueFrom } from 'rxjs';

import { AppComponent } from 'src/app/app.component'
import { Asegurado } from 'src/app/modules/asegurado/models/asegurado'
import { Consultorio } from 'src/app/modules/asegurado/models/consultorio';
import { GrupoFamiliar } from 'src/app/modules/asegurado/models/grupo-familiar';
import { ConsultoriosService } from 'src/app/modules/asegurado/services/consultorios.service';
import { CitasMedicasService } from 'src/app/modules/citas-medicas/services/citas-medicas.service'

import { AlertComponent } from '../../../components/alert/alert.component';
import { ConfirmationComponent } from '../../../components/confirmation/confirmation.component';
import { Hora } from '../../../models/hora';
import { HorarioEnLinea } from '../../../models/horario-en-linea';
import { HoraDisponible, MedicoConsultorio } from '../../../models/medico-consultorio';
import { ReservaEnLinea } from '../../../models/reserva-en-linea';
import { HorasService } from '../../../services/horas.service';
import { KardexService } from '../../../services/kardex.service';
import { ReporteService } from '../../../services/reporte.service';
import { ReservasService } from '../../../services/reservas.service';
import { ComunService } from 'src/app/shared/services/comun.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [DialogModule, FormsModule, CommonModule, DropdownModule, CalendarModule, DividerModule, InputTextModule, ButtonModule, ToastModule, ConfirmationComponent, AlertComponent],
  templateUrl: './reserva-form.component.html',
  styleUrl: './reserva-form.component.scss',
  providers: [DatePipe],
})

export class ReservaFormComponent {
  /* ATTRIBUTES
    ---------------------- */
  @Output() response = new EventEmitter();
  @ViewChild(ConfirmationComponent) confirmation!: ConfirmationComponent;
  @ViewChild(AlertComponent) alert!: AlertComponent;

  asegurado!: Asegurado;
  horarioEnLinea!: HorarioEnLinea;
  fechaReserva!: any;
  minDate!: Date;
  maxDate!: Date;
  serviciosDisponibles!: any;
  option!: number;
  beneficiarios!: GrupoFamiliar[];
  beneficiarioSelected!: GrupoFamiliar | null;
  consultorios!: Consultorio[];
  consultorio!: any;
  consultorioAdscrito!: any;
  medicosByConsultorio!: MedicoConsultorio[];
  horasDisponibles!: HoraDisponible[];
  medico!: MedicoConsultorio;
  horaDisponible!: HoraDisponible;
  hora!: Hora;
  numFichasPermitidas!: number;
  data!: ReservaEnLinea;
  reportPdf!: SafeResourceUrl;
  state!: boolean;

  /* METHODS
  ---------------------- */
  constructor(
    private datePipe: DatePipe,
    private citasMedicasService: CitasMedicasService,
    private messageService: MessageService,
    private reservaService: ReservasService,
    private kardexService: KardexService,
    private consultorioService: ConsultoriosService,
    private horasService: HorasService,
    private reporteService: ReporteService,
    private comunService: ComunService,
    public app: AppComponent,
  ) { }

  showCreate(asegurado: Asegurado, consultorio: any, horarioEnLinea: HorarioEnLinea, option: number) {
    this.asegurado = asegurado;
    this.consultorioAdscrito = consultorio;
    this.horarioEnLinea = horarioEnLinea;
    this.fechaReserva = this.comunService.getFecha();
    this.option = option;
    this.medicosByConsultorio = [];
    this.getBeneficiarios();
    this.setLimitFecha();
    this.getServiciosDisponibles();
    this.getNumFichasPermitidas();
    this.reportPdf = '';
    this.state = true;
  }

  showConfirmation(medico: MedicoConsultorio, horaDisponible: HoraDisponible, hora: Hora) {
    if (this.numFichasPermitidas < this.horarioEnLinea.cantidadFichas) {
      this.medico = medico;
      this.horaDisponible = horaDisponible;
      this.hora = hora;
      const beneficiarioId = this.beneficiarioSelected?.aseguradoId;
      if (beneficiarioId) {
        this.beneficiarioSelected = this.beneficiarios.find(b => b.aseguradoId === beneficiarioId) || null;
        this.confirmation.show(medico, this.fechaReserva, hora, this.beneficiarioSelected, this.consultorio);
      } else {
        const input = document.getElementById('aseguradoId');
        if (input) {
          input.focus();
        }
      }
    } else {
      const msg = {
        icono: 'pi pi-exclamation-triangle',
        titulo: 'Límite de cantidad de Fichas',
        contenido: 'Señor Asegurado, sólo está permitido reservar ' + this.horarioEnLinea.cantidadFichas + ' Cita(s) a la vez. Usted tiene ' + this.numFichasPermitidas + ' Cita(s) Pendientes. Si desea cambiar la hora de su Cita Mëdica, anule las que tiene pendiente.'
      };
      this.alert.show(msg)
    }
  }

  saveData() {
    this.prepareData();
    if (true) {
      console.log('saveData', this.data);
      this.reservaService.post(this.data).subscribe({
        next: () => {
          this.showPdf();
          this.messageService.add({ severity: 'success', summary: '¡Registro exitoso!', detail: 'Se guardó correctamente' });
        },
        error: () => {
          this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo guardar el registro' });
        }
      });

    } else {
      console.log('data', this.data)
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Datos Incompletos o Incorrectos...!!',
      });
    }
  }

  async showPdf() {
    const data = {
      'regional': this.asegurado.ubicacion,
      'centroMedico': this.asegurado.centroMedico,
      'consultorio': this.consultorio,
      'paciente': this.beneficiarioSelected?.nombres + ' ' + this.beneficiarioSelected?.paterno,
      'medico': this.medico.nombres,
      'fechaReserva': this.datePipe.transform(this.fechaReserva),
      'ficha': this.hora.numero,
      'horaInicio': this.hora.inicioDetalle,
      'horaFin': this.hora.finDetalle,
      'usuario': this.asegurado.titular
    }
    this.reportPdf = await this.reporteService.generateReportFicha(data);
    console.log('reportpdf', this.reportPdf);
  }

  close() {
    this.state = false;
  }

  /* METHODS AUX
  -------------------------*/
  getBeneficiarios() {
    this.citasMedicasService.getGrupoFamiliarAsegurados(this.asegurado.grupoFamiliarId, Number(this.asegurado.parametroTipoParentescoId)).subscribe({
      next: response => {
        this.beneficiarios = response
        console.log('RESPONSE->getBeneficiarios', this.beneficiarios);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Beneficiarios no encontrados.' });
        console.log('ERROR->getBeneficiarios: ', error.error);
      }
    })
  }

  setLimitFecha() {
    const fechaActual = this.comunService.getFecha();
    this.minDate = fechaActual;
    if (this.horarioEnLinea?.rangoHabilitacion == 1) {
      this.maxDate = fechaActual;
    } else if (this.horarioEnLinea?.rangoHabilitacion == 2) {
      const fechaMax = fechaActual;
      const diasParaDomingo = 7 - fechaMax.getDay();
      fechaMax.setDate(fechaMax.getDate() + diasParaDomingo);
      this.maxDate = fechaMax;
    } else if (this.horarioEnLinea?.rangoHabilitacion == 3) {
      const fechaMax = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
      this.maxDate = fechaMax;
    }
  }

  getServiciosDisponibles() {
    this.kardexService.getConsultorioMedicos({ centroMedicoId: this.asegurado.centroMedicoId })
      .subscribe({
        next: async (response) => {
          this.serviciosDisponibles = response;
          switch (this.option) {
            case 1:
              this.getConsultorioConsultaExterna();
              break;
            case 2:
              this.getConsultoriosOdontologia();
              break;
            case 3:
              this.getConsultoriosPediatria();
              break;
          }
          console.log('RESPONSE->getServiciosDisponibles ', response);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Servicios Disponibles no obtenidos..!!' });
          console.log('ERROR->getServiciosDisponibles: ', error.error);
        }
      });
  }

  getConsultorioConsultaExterna() {
    this.consultorioService.getConsultorios(this.asegurado.centroMedicoId).subscribe({
      next: response => {
        this.consultorios = response;
        this.consultorio = this.consultorios.find(c => c.id == this.consultorioAdscrito.consultorioId);
        this.getFichasDisponibles();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Consultorio Consulta Externa, no obtenido.' });
        console.log('ERROR->getConsultorioConsultaExterna: ', error.error);
      }
    })
  }

  getConsultoriosOdontologia() {
    this.consultorioService.getConsultorios(this.asegurado.centroMedicoId).subscribe({
      next: response => {
        this.consultorios = response;
        this.consultorios = this.consultorios.filter(val => val.tipoConsultorio.abreviatura == 'OD');
        console.log('RESPONSE->getConsultoriosOdontologia: ', this.consultorios);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Consultorios Odontología, no obtenidos.' });
        console.log('ERROR->getConsultoriosOdontologia: ', error.error);
      }
    })
  }

  getConsultoriosPediatria() {
    this.consultorioService.getConsultorios(this.asegurado.centroMedicoId).subscribe({
      next: response => {
        this.consultorios = response;
        this.consultorios = this.consultorios.filter(val => val.tipoConsultorio.abreviatura == 'P');
        console.log('RESPONSE->getConsultoriosPediatria: ', this.consultorios);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Consultorios Pediatría, no obtenidos.' });
        console.log('ERROR->getBeneficiarios: ', error.error);
      }
    })
  }

  async getFichasDisponibles() {
    this.medicosByConsultorio = this.serviciosDisponibles.filter(
      (val: any) => val.consultorioId === this.consultorio.id
    );
    for (const medico of this.medicosByConsultorio) {
      const horasDisponibles = await this.getHorasDisponibles(
        medico.consultorioId,
        medico.medicoUsuarioId
      );
      medico.horasDisponibles = horasDisponibles ?? [];
    }
    await this.getHorasReservadas();
    console.log('RESPONSE->getFichasDisponibles: ', this.medicosByConsultorio);
  }

  private async getHorasDisponibles(consultorioId: number, medicoUsuarioId: string) {
    const data = {
      fechaReserva: this.datePipe.transform(this.fechaReserva, 'yyyy-MM-dd'),
      horaId: 0,
    };
    return await lastValueFrom(this.horasService.getByConsultorio(consultorioId, medicoUsuarioId, data)) ?? [];
  }

  private async getHorasReservadas() {
    for (const medico of this.medicosByConsultorio) {
      console.log('medico', medico)
      if (medico.horasDisponibles) {
        for (const hora of medico.horasDisponibles) {
          console.log('hora', hora)
          const data = {
            consultorioHorarioId: hora.consultorioHorarioId,
            fechaReserva: this.datePipe.transform(this.fechaReserva, 'yyyy-MM-dd') ?? '',
          };
          hora.horasReservadas = await lastValueFrom(this.reservaService.getByConsultorioHorario(data));
        }
      }
    }
  }

  private getNumFichasPermitidas() {
    this.reservaService.getPendientesByAsegurado({ aseguradoId: this.asegurado.aseguradoId, estadoReservaId: 1 }).subscribe({
      next: response => {
        this.numFichasPermitidas = response.length;
        console.log('RESPONSE->getNumFichas: ', this.numFichasPermitidas);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'NumFichas, no obtenido.' });
        console.log('ERROR->getNumFichas: ', error.error);
      }
    })
  }

  filterMedicos(medico: MedicoConsultorio,) {
    const consultorios = this.horarioEnLinea.consultorios;
    for (const consultorio of consultorios) {
      if (consultorio.medicoUsuarioId === medico.medicoUsuarioId) {
        return true;
      }
    }
    return false;
  }

  filterFichas(medico: MedicoConsultorio, hora: Hora,) {
    for (const consultorio of this.horarioEnLinea.consultorios) {
      if (
        medico.consultorioId === consultorio.consultorioId &&
        medico.medicoUsuarioId === consultorio.medicoUsuarioId &&
        consultorio.horasEnLinea.some(h => h.consultorioHorarioId === hora.consultorioHorarioId && h.horaId === hora.id)) {
        return true;
      }
    }
    return false;
  }

  isReservada(horaDisponible: HoraDisponible, hora: Hora,) {
    if (horaDisponible.horasReservadas) {
      for (const horaReservada of horaDisponible.horasReservadas) {
        if (horaReservada.hora.id === hora.id) {
          return true;
        }
      }
    }
    return false;
  }

  prepareData() {
    this.data = {
      fechaReserva: this.datePipe.transform(this.fechaReserva, 'yyyy-MM-dd'),
      observaciones: 'Reservado desde Agenda Médica',
      horaId: this.hora.id,
      aseguradoId: this.asegurado.aseguradoId,
      consultorioHorarioId: this.hora.consultorioHorarioId,
      medicoUsuarioId: this.medico.medicoUsuarioId,
      estadoReservaId: 1,
      fuenteRegistroId: 6,
      consultorioAdscritoId: 0,
      grupoFamiliarId: this.asegurado.grupoFamiliarId,
      tipoReserva: 2,
      isNuevo: false
    };
  }

  getConsultorioDescripcion(id: number) {
    return this.consultorios.find(x => x.id == id);
  }
}
