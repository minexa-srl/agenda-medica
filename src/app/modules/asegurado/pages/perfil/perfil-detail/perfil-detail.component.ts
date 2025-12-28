import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MessagesModule } from 'primeng/messages'
import { ToastModule } from 'primeng/toast'

import { AppComponent } from 'src/app/app.component'
import { AdscripcionTemporal } from 'src/app/modules/asegurado/models/adscripcion-temporal'
import { Asegurado } from 'src/app/modules/asegurado/models/asegurado'
import { Consultorio } from 'src/app/modules/asegurado/models/consultorio'
import { ConsultorioAsegurado } from 'src/app/modules/asegurado/models/consultorio-asegurado'
import { AdscripcionTemporalService } from 'src/app/modules/asegurado/services/adscripcion-temporal.service'
import { ConsultoriosService } from 'src/app/modules/asegurado/services/consultorios.service'
import { CitasMedicasService } from 'src/app/modules/citas-medicas/services/citas-medicas.service'

@Component({
  selector: 'app-perfil-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessagesModule, ToastModule],
  templateUrl: './perfil-detail.component.html',
  styleUrl: './perfil-detail.component.scss',
  providers: [MessageService],
})
export class PerfilDetailComponent implements OnInit {
  asegurado!: Asegurado
  consultorio!: ConsultorioAsegurado
  consultorioDetalle!: Consultorio
  adscripcionTemporal!: AdscripcionTemporal
  img!: object

  constructor(
    private citasMedicasService: CitasMedicasService,
    private consultoriosService: ConsultoriosService,
    private adscripcionTemporalService: AdscripcionTemporalService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    public app: AppComponent,
  ) { }

  ngOnInit(): void {
    this.getDatosAsegurado()
  }

  displayAlerta() {
    this.messageService.clear('alerta')
    this.messageService.add({
      key: 'alerta',
      sticky: true,
      severity: 'warn',
      summary:
        'Su empresa se encuentra en Mora lo cual imposibilitará el uso del servicio de citas medicas',
      life: 10000,
    })
  }

  onRejectAlerta() {
    this.messageService.clear('alerta')
  }

  onConfirmAlerta() {
    this.messageService.clear('alerta')
  }

  getConsultorioTemporal(grupoFamiliarId: number) {
    this.adscripcionTemporalService.getByGrupoFamiliarId(grupoFamiliarId).subscribe({
      next: response => {
        this.adscripcionTemporal = response
      },
    })
  }

  getConsultorioDetalle(consultorioId: number) {
    console.log('consulDetalle..')
    this.consultoriosService.getById(consultorioId).subscribe({
      next: response => {
        this.consultorioDetalle = response
        console.log('consulDetalle', response)
      },
    })
  }

  getConsultorioAsegurado(grupoFamiliarId: number) {
    this.citasMedicasService.getConsultorio(grupoFamiliarId).subscribe({
      next: response => {
        this.consultorio = response
        console.log('consul', response)
      },
    })
  }

  getDatosAsegurado() {
    this.citasMedicasService.getAsegurado(this.app.getUser()?.document ?? '', this.app.getUser()?.birthdate ?? '').subscribe({
      next: response => {
        this.asegurado = response
      },
      complete: () => {
        this.getConsultorioAsegurado(this.asegurado.grupoFamiliarId)
        if (this.asegurado.imagen !== 'Sin Fotografia') {
          const objectURL = 'data:image/png;base64,' + this.asegurado.imagen
          this.img = this.sanitizer.bypassSecurityTrustUrl(objectURL)
        }
        if (this.asegurado.consultorioId === 0) {
          this.getConsultorioTemporal(this.asegurado.grupoFamiliarId)
        } else {
          this.getConsultorioDetalle(this.asegurado.consultorioId)
        }
      },
    })
  }
}
