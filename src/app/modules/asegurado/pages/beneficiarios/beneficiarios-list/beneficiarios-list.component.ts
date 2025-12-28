import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MenuItem, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { DialogModule } from 'primeng/dialog'
import { DividerModule } from 'primeng/divider'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { MenubarModule } from 'primeng/menubar'
import { MessagesModule } from 'primeng/messages'
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'

import { AppComponent } from 'src/app/app.component'
import { Asegurado } from 'src/app/modules/asegurado/models/asegurado'
import { BeneficiarioDeclaracion } from 'src/app/modules/asegurado/models/beneficiario-declaracion'
import { GrupoFamiliar } from 'src/app/modules/asegurado/models/grupo-familiar'
import { Regularizacion } from 'src/app/modules/asegurado/models/regularizacion'
import { AfiliacionesService } from 'src/app/modules/asegurado/services/afiliaciones.service'
import { CitasMedicasService } from 'src/app/modules/citas-medicas/services/citas-medicas.service'
import { Paginacion } from 'src/app/shared/models/paginacion'

import { BeneficiarioFormComponent } from '../beneficiario-form/beneficiario-form.component'
import { DeclaracionFormComponent } from '../declaracion-form/declaracion-form.component'

@Component({
  selector: 'app-beneficiarios-list',
  standalone: true,
  templateUrl: './beneficiarios-list.component.html',
  styleUrl: './beneficiarios-list.component.scss',
  imports: [TableModule, MenubarModule, CommonModule, BeneficiarioFormComponent, DeclaracionFormComponent, DialogModule, ReactiveFormsModule, DropdownModule, CalendarModule, DividerModule, InputTextModule, ButtonModule, MessagesModule, ToastModule],
  providers: [MessageService],
})

export class BeneficiariosListComponent implements OnInit {
  menuTable: MenuItem[] = []
  search = ''
  grupoFamiliar: GrupoFamiliar[] = []
  selectedItem!: GrupoFamiliar
  regularizaciones: Regularizacion[] = []
  selectedItemRegularizacion!: Regularizacion
  asegurado!: Asegurado
  declaracionAsegurado!: BeneficiarioDeclaracion[]
  rows = 10
  paginaActual = 1
  openForm = false
  openFormDeclaracion = false
  noAfi = false
  regu: boolean = false
  beneficiariosArray: GrupoFamiliar[] = []
  regularizacionesArray: Regularizacion[] = []
  tituloMensaje = ''

  constructor(
    private afiliacionesService: AfiliacionesService,
    private citasMedicasService: CitasMedicasService,
    private messageService: MessageService,
    public app: AppComponent,
  ) { }

  ngOnInit(): void {
    this.getDataAsegurado()
    this.getMenu()
  }

  getDataAsegurado() {
    this.citasMedicasService.getAsegurado(this.app.getUser()?.document ?? '', this.app.getUser()?.birthdate ?? '').subscribe({
      next: response => {
        this.asegurado = response
      },
      complete: () => {
        this.displayInformacion()
        if (this.asegurado) {
          this.LoadBeneficiarios()
        } else {
          this.noAfi = true
        }
        this.getDeclaracion()
      },
    })
  }

  LoadBeneficiarios() {
    this.citasMedicasService
      .getGrupoFamiliarAsegurados(this.asegurado.grupoFamiliarId, 1)
      .subscribe({
        next: response => {
          this.grupoFamiliar = response
        },
        complete: () => {
          this.afiliacionesService.getListRegularizaciones(this.asegurado.aseguradoId).subscribe({
            next: response => {
              this.regularizaciones = response
            },
            complete: () => {
              this.regu = this.regularizaciones.length > 0
              this.beneficiariosArray = []
              this.asegurado.pareja = 'NN'
              this.grupoFamiliar.map((gf: GrupoFamiliar) => {
                if (gf.parametroTipoParentescoId !== 1) {
                  this.getPareja(gf.parentesco)
                  gf.info = 1
                  gf.infoVal2 = ''
                  this.regularizaciones.map((r: Regularizacion) => {
                    this.getPareja(r.tipoBeneficiario.toString())
                    if (gf.isValidado === 1) {
                      gf.info = 0
                    }
                    if (gf.aseguradoId == r.beneficiarioId && r.estado == 2) {
                      gf.info = 0
                    }
                  })
                  this.beneficiariosArray.push(gf)
                }
              })
              this.regularizacionesArray = []
              this.regularizaciones.map((r: Regularizacion) => {
                if (r.beneficiarioId != this.asegurado.aseguradoId) {
                  this.regularizacionesArray.push(r)
                }
              })
            },
          })
        },
      })
  }

  getPareja(parentesco: string) {
    if (this.asegurado.pareja == 'NN') {
      if (parentesco == 'CONVIVIENTE' || parentesco == '11') {
        this.asegurado.pareja = 'CONVIVIENTE'
      }
      if (parentesco == 'ESPOSO' || parentesco == '10') {
        this.asegurado.pareja = 'ESPOSO'
      }
      if (parentesco == 'ESPOSA' || parentesco == '9') {
        this.asegurado.pareja = 'ESPOSA'
      }
    }
  }

  getMenu() {
    this.menuTable = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus-circle',
        command: () => {
          if (this.declaracionAsegurado.length > 0) {
            this.openForm = true
          } else {
            this.openFormDeclaracion = true
          }
        },
      },
    ]
  }

  onRowSelect() { }

  onRowUnselect() { }

  paginate($event: Paginacion) {
    this.paginaActual = $event?.first / $event.rows + 1
  }

  getEstadoAfiliacion(estado: string) {
    switch (estado) {
      case '1':
        return 'Activo'
      case '2':
        return 'Baja Temporal'
      case '3':
        return 'Baja Definitiva'
      default:
        return ''
    }
  }

  closeForm() {
    this.openForm = false
  }

  closeFormDeclaracion() {
    this.openFormDeclaracion = false
  }

  handleCloseForm() {
    this.closeForm()
    this.getDataAsegurado()
  }

  handleCloseFormDeclaracion() {
    this.closeFormDeclaracion()
    this.getDataAsegurado()
  }

  getDeclaracion() {
    this.afiliacionesService.getDeclaracion({ userName: this.asegurado.matricula }).subscribe({
      next: response => {
        this.declaracionAsegurado = response
      },
    })
  }

  displayInformacion() {
    this.tituloMensaje = 'Información'
    this.messageService.add({
      key: 'msj-info',
      sticky: true,
      severity: 'success',
      summary:
        'Esta opción permitirá regularizar el registro de los datos de sus beneficiarios, que no figuren en el detalle del titular en el sistema, datos que deberán ser transcritos tal cual se encuentre en el formulario AVC- 06 de beneficiario, en caso de ser una nueva afiliación deberá apersonarse a las unidades de Afiliación con los requisitos correspondientes.',
      life: 10000,
    })
  }

  onRejectInfo() {
    this.messageService.clear('msj-info')
  }

  onConfirmInfo() {
    this.messageService.clear('msj-info')
  }

  getTipoModificacion(tipo: number) {
    switch (tipo) {
      case 1:
        return 'Nuevo'
      case 2:
        return 'Centro Medico'
      case 3:
        return 'Documento Identidad'
      default:
        return ''
    }
  }

  getColorTipoModificacion(estado: number) {
    switch (estado) {
      case 2:
        return 'orange'
      case 4:
        return 'red'
      case 5:
        return 'red'
      default:
        return ''
    }
  }

  getEstado(estado: number) {
    switch (estado) {
      case 2:
        return 'Regularización'
      case 4:
        return 'Rechazado'
      case 5:
        return 'Observado'
      case 1:
        return 'Modificación'
      default:
        return ''
    }
  }

  getColorEstado(estado: number) {
    switch (estado) {
      case 2:
        return 'orange'
      case 4:
        return 'red'
      case 5:
        return 'orange'
      case 1:
        return 'orange'
      default:
        return ''
    }
  }
}
