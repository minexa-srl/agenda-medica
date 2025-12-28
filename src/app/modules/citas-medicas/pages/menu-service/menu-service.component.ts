/* CONTROLLER MENU-SERVICES
============================================= */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';

import { AppComponent } from 'src/app/app.component';
import { Asegurado } from 'src/app/modules/asegurado/models/asegurado';
import { CitasMedicasService } from 'src/app/modules/citas-medicas/services/citas-medicas.service';
import { ComunService } from 'src/app/shared/services/comun.service';

import { AlertComponent } from '../../components/alert/alert.component';
import { HorarioEnLinea } from '../../models/horario-en-linea';
import { HorarioEnLineaService } from '../../services/horario-en-linea.service';
import { MenuConsultorioComponent } from '../menu-consultorio/menu-consultorio.component';
import { ReservaFormComponent } from '../reserva/reserva-form/reserva-form.component';
import { AdscripcionService } from 'src/app/modules/asegurado/services/adscripcion.service';

@Component({
  selector: 'app-menu-service',
  standalone: true,
  imports: [CommonModule, CardModule, TreeTableModule, ButtonModule, AlertComponent, DialogModule, MenuConsultorioComponent, ReservaFormComponent],
  templateUrl: './menu-service.component.html',
  styleUrls: ['./menu-service.component.scss'],
})
export class MenuServiceComponent implements OnInit {

  /* ATTRIBUTES
  ---------------------- */
  @ViewChild(AlertComponent) alert!: AlertComponent;
  @ViewChild(MenuConsultorioComponent) menuConsultorio!: MenuConsultorioComponent;
  @ViewChild(ReservaFormComponent) reserva!: ReservaFormComponent;
  asegurado!: Asegurado;
  consultorio!: any;
  horarioEnLinea!: HorarioEnLinea;

  /* METHODS
  ---------------------- */
  constructor(
    private router: Router,
    private horarioEnLineaService: HorarioEnLineaService,
    private citasMedicasService: CitasMedicasService,
    private adscripcionService: AdscripcionService,
    private comunService: ComunService,
    private messageService: MessageService,
    public app: AppComponent
  ) { }

  ngOnInit(): void {
    this.show();
  }

  show(): void {
    this.getAsegurado();
  }

  showMenuConsultorios() {
    if (this.validateSistema() && this.validateAsegurado())
      this.menuConsultorio.show();
  }

  showCreateCita(option: number) {
    this.reserva.showCreate(this.asegurado, this.consultorio, this.horarioEnLinea, option);
  }

  showCitasPendientes() {
    this.router.navigateByUrl('citas-medicas/reserva-list');
  }

  showHistorialCitas() {
    this.router.navigateByUrl('citas-medicas/historial-list');
  }

  /* METHODS AUX
  -------------------------*/
  private getAsegurado() {
    this.citasMedicasService.getAsegurado(this.app.getUser()?.document ?? '', this.app.getUser()?.birthdate ?? '').subscribe({
      next: response => {
        this.asegurado = response;
        this.getLastHorarioEnLinea();
        this.getAdscripcion();
        console.log('RESPONSE->getAsegurado ', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Asegurado no obtenido..!!' });
        console.log('ERROR->getAsegurado: ', error.error);
      }
    })
  }

  private getLastHorarioEnLinea() {
    this.horarioEnLineaService.getLastByCentroMedicoId(this.asegurado.centroMedicoId).subscribe({
      next: response => {
        this.horarioEnLinea = response
        console.log('RESPONSE->getLastHorarioEnLinea', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Horario En Línea no obtenido..!!' });
        console.log('ERROR->getLastHorarioEnLinea: ', error.error);
      }
    })
  }

  private getAdscripcion() {
    this.adscripcionService.getByGrupoFamiliarId(this.asegurado.grupoFamiliarId).subscribe({
      next: response => {
        this.consultorio = response
        console.log('RESPONSE->getAdscripcion', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Adscripción no obtenido..!!' });
        console.log('ERROR->getAdscripcion: ', error.error);
      }
    })
  }

  private validateSistema(): boolean {
    const horaActual = this.comunService.getHoraActual();
    const today = new Date();
    const dia = today.getDay();
    const nombresDias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diasTexto = this.horarioEnLinea?.diasAtencion?.map((d: number) => nombresDias[d]).join(', ');
    let response = true;
    if (this.horarioEnLinea == null) {
      const msg = {
        icono: 'pi pi-exclamation-triangle',
        titulo: 'Centro Médico no Habilitado',
        contenido: 'Señor Asegurado, Su Centro Médico no está habilitado para realizar Citas en Línea. Por favor notifique el inconveniente al telefóno: 67610910'
      };
      this.alert.show(msg);
      response = false;
    }
    if (this.horarioEnLinea && (horaActual < this.horarioEnLinea.horaApertura || horaActual > this.horarioEnLinea.horaCierre || !this.horarioEnLinea.diasAtencion.includes(dia))) {
      const msg = {
        icono: 'pi pi-exclamation-triangle',
        titulo: 'Sistema Cerrado',
        contenido: `Señor Asegurado, el horario de atención del Sistema de Citas en Línea es de: ${this.horarioEnLinea?.horaApertura} hasta: ${this.horarioEnLinea?.horaCierre}. Los días: ${diasTexto}`
      };
      this.alert.show(msg);
      response = false;
    }
    return response;
  }

  private validateAsegurado(): boolean {
    let response = true;
    if (this.asegurado.estadoAsegurado == 'BAJA TEMPORAL') {
      const msg = {
        'icono': 'pi pi-exclamation-triangle',
        'titulo': 'Estado de Asegurado',
        'contenido': 'Señor Asegurado, no es posible que pueda acceder al servicio de Citas Médicas en Línea debido a que, su estado de Asegurado se encuenta con ' + this.asegurado.estadoAsegurado
      }
      this.alert.show(msg);
      response = false;
    }
    if (this.asegurado.estadoAporte == 'NO VIGENTE') {
      const msg = {
        'icono': 'pi pi-exclamation-triangle',
        'titulo': 'Estado de Aportes',
        'contenido': 'Señor Asegurado, no es posible que pueda acceder al servicio de Citas Médicas en Línea debido a que, su estado de Aporte se encuenta ' + this.asegurado.estadoAsegurado
      }
      this.alert.show(msg);
      response = false;
    }
    if (this.asegurado.estadoEmpresa != 'AL DÍA') {
      const msg = {
        'icono': 'pi pi-exclamation-triangle',
        'titulo': 'Estado de Empresa',
        'contenido': 'Señor Asegurado, no es posible que pueda acceder al servicio de Citas Médicas en Línea debido a que, su Empresa se encuenta ' + this.asegurado.estadoAsegurado
      }
      this.alert.show(msg);
      response = false;
    }
    if (this.consultorio == null) {
      const msg = {
        'icono': 'pi pi-exclamation-triangle',
        'titulo': 'Consultorio no Asignaco',
        'contenido': 'Señor Asegurado, no es posible que pueda acceder al servicio de Citas Médicas en Línea debido a que, no cuenta con un consultorio Asignado. Favor pasar por Ventanilla de Vigencia de Derechos para regularizar su asignación.'
      }
      this.alert.show(msg);
      response = false;
    }
    return response;
  }
}
