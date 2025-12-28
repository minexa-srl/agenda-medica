import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'

import { Asegurado } from 'src/app/modules/asegurado/models/asegurado'
import { AfiliacionesService } from 'src/app/modules/asegurado/services/afiliaciones.service'

@Component({
  selector: 'app-declaracion-form',
  standalone: true,
  imports: [ButtonModule, ToastModule],
  templateUrl: './declaracion-form.component.html',
  styleUrl: './declaracion-form.component.scss',
  providers: [MessageService],
})
export class DeclaracionFormComponent implements OnInit, OnChanges {
  @Input() asegurado!: Asegurado
  @Output() closed = new EventEmitter()
  dataForm!: FormGroup
  control: boolean = true
  controlSave: boolean = true
  tituloMensaje = ''

  constructor(
    private fb: FormBuilder,
    private afiliacionesService: AfiliacionesService,
    private messageService: MessageService,
  ) { }

  get f() {
    return this.dataForm.controls
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('asegurado' in changes) {
      if (this.asegurado) {
        this.buildForm()
      }
    }
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.dataForm = this.fb.group({
      validacion: [],
      UserName: '',
    })
  }

  leer() {
    window.open('../../../../assets/docs/ayuda-regularizacionv2.pdf', '_blank')
  }

  save() {
    if (!this.dataForm.value.validacion) {
      this.dataForm.controls['UserName'].setValue(this.asegurado.matricula)
      this.dataForm.controls['validacion'].setValue(true) //defecto
      this.afiliacionesService
        .postBeneficiarioDeclaracion(this.dataForm.value)
        .subscribe((response: number) => {
          if (response > 0) {
            this.tituloMensaje = 'Confirmación'
            this.messageService.add({
              key: 'confirm',
              sticky: true,
              severity: 'success',
              summary: '¡Se aceptó el compromiso!',
              life: 5000,
            })
          }
        })
    }
    this.cancel()
    this.control = false
  }

  cancel() {
    this.closed.emit(false)
  }

  onReject() {
    this.messageService.clear('confirm')
  }
}
