import { CommonModule, DatePipe } from '@angular/common'
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { DialogModule } from 'primeng/dialog'
import { DividerModule } from 'primeng/divider'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { ToastModule } from 'primeng/toast'

import { Asegurado } from 'src/app/modules/asegurado/models/asegurado'
import { Parametro } from 'src/app/modules/asegurado/models/parametro'
import { TrabajorExistencia } from 'src/app/modules/asegurado/models/trabajor-existencia'
import { Zonificacion } from 'src/app/modules/asegurado/models/zonificacion'
import { AfiliacionesService } from 'src/app/modules/asegurado/services/afiliaciones.service'
import { ErpParametrosService } from 'src/app/modules/asegurado/services/erp-parametros.service'
import { UbicacionesService } from 'src/app/modules/asegurado/services/ubicaciones.service'

@Component({
  selector: 'app-beneficiario-form',
  standalone: true,
  imports: [DialogModule, FormsModule, ReactiveFormsModule, CommonModule, DropdownModule, CalendarModule, DividerModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './beneficiario-form.component.html',
  styleUrl: './beneficiario-form.component.scss',
  providers: [MessageService, DatePipe],
})
export class BeneficiarioFormComponent implements OnInit, OnChanges {
  @Input() asegurado!: Asegurado
  @Output() Closed = new EventEmitter()
  dataForm!: FormGroup
  dropHijos = false
  genero = [
    { label: 'MASCULINO', value: 1 },
    { label: 'FEMENINO', value: 2 },
  ]
  tipoBeneficiario: Parametro[] = []
  extensiones: Parametro[] = []
  estadoCivil: Parametro[] = []
  departamento: Zonificacion[] = []
  hijos: Parametro[] = []
  hijas: Parametro[] = []
  denominacion: Parametro[] = []
  tituloMensaje = ''

  constructor(
    private fb: FormBuilder,
    private erpParametrosService: ErpParametrosService,
    private ubicacionesService: UbicacionesService,
    private messageService: MessageService,
    private afiliacionesService: AfiliacionesService,
    private datePipe: DatePipe,
  ) { }

  get f() {
    return this.dataForm.controls
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('asegurado' in changes) {
      if (this.asegurado) {
        this.setValueForm()
        this.getResourses()
      }
    }
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.dataForm = this.fb.group({
      tipoAfiliacion: [null, [Validators.required]],
      tipoDocumento: 1,
      documentoIdentidad: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(11),
          Validators.pattern('^[0-9,$]*$'),
        ],
      ],
      complemento: [],
      extension: [null, [Validators.required]],
      primerApellido: [null, [Validators.required]],
      segundoApellido: [null],
      nombres: [null, [Validators.required]],
      fechaNacimiento: [null, [Validators.required]],
      lugarNacimiento: [null, [Validators.required]],
      genero: [null, [Validators.required]],
      estadoCivil: [null, [Validators.required]],
      grupoFamiliarId: 0,
      ubicacionId: 0,
      denominacionHijo: [0],
      matricula: [null],
      user: [null],
      nroForm: [null],
      email: [null],
      estadoRegistroId: [2],
      titularId: 0,
      tipoModificacion: 1,
    })
  }

  setValueForm() {
    this.dataForm.setValue({
      tipoAfiliacion: null,
      tipoDocumento: 1,
      documentoIdentidad: null,
      complemento: '',
      extension: null,
      primerApellido: null,
      segundoApellido: null,
      nombres: null,
      fechaNacimiento: new Date(),
      lugarNacimiento: null,
      genero: null,
      estadoCivil: null,
      grupoFamiliarId: this.asegurado.grupoFamiliarId,
      ubicacionId: this.asegurado.ubicacionRegionalId,
      denominacionHijo: 0,
      matricula: '',
      user: '',
      nroForm: '',
      email: '',
      estadoRegistroId: 2,
      titularId: this.asegurado.aseguradoId,
      tipoModificacion: 1,
    })
  }

  close() {
    this.Closed.emit()
  }

  saveData() {
    if (!this.dataForm.valid) {
      this.dataForm.markAllAsTouched()
    }
    this.afiliacionesService
      .getVerificar(
        this.dataForm.value.documentoIdentidad,
        this.dataForm.value.primerApellido,
        this.dataForm.value.segundoApellido,
        this.dataForm.value.nombres,
        this.buildDates(new Date()),
        this.dataForm.value.genero,
      )
      .subscribe((response: TrabajorExistencia[]) => {
        if (response.length > 0) {
          this.dataForm.controls['estadoRegistroId'].setValue(2)
        } else {
          this.dataForm.controls['estadoRegistroId'].setValue(5)
        }
        this.tituloMensaje = '¿Está seguro de realizar el registro?'
        this.messageService.add({
          key: 'confirm',
          sticky: true,
          severity: 'success',
          summary:
            '¡No se realizo correctamente su registro!. Debe apersonarse a las Oficinas de Afiliaciones.',
        })
      })
  }

  selectTipoAfiliacion($event: number) {
    this.dataForm.controls['genero'].enable()
    this.dataForm.controls['estadoCivil'].enable()
    this.dataForm.controls['genero'].setValue(null)
    this.dataForm.controls['estadoCivil'].setValue(null)
    this.dropHijos = false
    switch ($event) {
      case 9:
        this.dataForm.controls['genero'].setValue(2)
        this.dataForm.controls['genero'].disable()
        this.dataForm.controls['estadoCivil'].setValue(2)
        this.dataForm.controls['estadoCivil'].disable()
        break
      case 10:
        this.dataForm.controls['genero'].setValue(1)
        this.dataForm.controls['genero'].disable()
        this.dataForm.controls['estadoCivil'].setValue(2)
        this.dataForm.controls['estadoCivil'].disable()
        break
      case 12:
        this.dataForm.controls['estadoCivil'].setValue(1)
        this.dataForm.controls['estadoCivil'].disable()
        this.dropHijos = true
        this.dataForm.controls['denominacionHijo'].setValue(null)
        break
      case 13:
        this.dataForm.controls['estadoCivil'].setValue(1)
        this.dataForm.controls['estadoCivil'].disable()
        this.dropHijos = true
        this.dataForm.controls['denominacionHijo'].setValue(null)
        break
      case 14:
        this.dataForm.controls['estadoCivil'].setValue(1)
        this.dataForm.controls['estadoCivil'].disable()
        this.dropHijos = true
        this.dataForm.controls['denominacionHijo'].setValue(null)
        break
      default:
        break
    }
  }

  selectGenero(obj: number) {
    const tipo = this.dataForm.value.tipoAfiliacion
    if (tipo == 12 || tipo == 13 || tipo == 14) {
      switch (obj) {
        case 1:
          this.denominacion = this.hijos
          this.dataForm.controls['denominacionHijo'].setValue(3)
          break
        case 2:
          this.denominacion = this.hijas
          this.dataForm.controls['denominacionHijo'].setValue(16)
          break
        default:
          break
      }
    }
  }

  buildDates(jj: Date) {
    const year = jj.getFullYear()
    const month = jj.getMonth() + 1 < 10 ? `0${jj.getMonth() + 1}` : jj.getMonth() + 1
    const day = jj.getDate() + 1 < 10 ? `0${jj.getDate()}` : jj.getDate()
    return `${year}-${month}-${day}`
  }

  async getResourses() {
    let ti = '1,2,3,4,5,6,7,8,9,10,11,17,18,19'
    if (this.asegurado.pareja == 'NN') {
      ti = '1,2,3,4,5,6,7,8,9,17,18,19'
      if (this.asegurado.sexo === 1) {
        ti = '1,2,3,4,5,6,7,8,10,17,18,19'
      }
    }

    this.erpParametrosService.getParametros(35, ti).subscribe(response => {
      this.tipoBeneficiario = response
      this.tipoBeneficiario.map((tb: Parametro) => {
        tb.descripcion = tb.descripcion.replace('Requisitos de Afiliación de la ', '')
        tb.descripcion = tb.descripcion.replace('Requisitos de Afiliación de ', '')
      })
    })

    this.erpParametrosService.getParametros(3, '').subscribe(response => {
      this.extensiones = response
    })

    this.erpParametrosService.getParametros(1, '0').subscribe(response => {
      this.estadoCivil = response
    })

    this.ubicacionesService.getZonificacion(1).subscribe(response => {
      this.departamento = response
    })

    this.erpParametrosService
      .getParametros(33, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,26,27,28,29,31,33,34,35')
      .subscribe(response => {
        this.hijas = response
      })

    this.erpParametrosService
      .getParametros(33, '1,2,13,14,15,16,17,18,19,20,21,22,23,24,25,30,32,26,27,28,29,34,35')
      .subscribe(response => {
        this.hijos = response
      })
  }

  onRejectVerify() {
    this.messageService.clear('confirm')
  }

  onConfirmVerify() {
    this.dataForm.controls['fechaNacimiento'].setValue(
      this.datePipe.transform(this.dataForm.controls['fechaNacimiento'].value, 'yyyy-MM-dd'),
    )
    this.afiliacionesService.postBeneficiario(this.dataForm.value).subscribe((response: number) => {
      console.log(response)
    })
    this.messageService.clear('confirm')
    this.Closed.emit()
  }
}
