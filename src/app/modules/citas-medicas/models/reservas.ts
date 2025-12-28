import { Hora } from 'src/app/modules/citas-medicas/models/hora'

import { Asegurado } from '../../asegurado/models/adscripcion-temporal'
import { TipoConsultorio, TipoEspecialidad } from '../../asegurado/models/consultorio'

export interface Reservas {
  fechaReserva: string
  consultorios: ConsultorioMedicoHorario[]
  hora: Hora
  asegurado: Asegurado
  medicoUsuario: MedicosHorarios
  estadoReserva: EstadoReserva
}

export interface ConsultorioMedicoHorario {
  consultorioId: number
  centroMedicoId: number
  medicos: MedicosHorarios[]
  detalleConsultorio: DetalleConsultorio
}

export interface MedicosHorarios {
  medicoUsuarioId: string
  nombres: string
  documento: string
  horarios: Horario[]
}

export interface Horario {
  id: number
  descripcion: string
  hraInicio: string
  hraFin: string
  citasProgramadas: number
  citasReprogramadas: number
  fichasDisponiles: number
  estado: boolean
  isInhabilitado: boolean
  inhabilitaciones: Inhabilitacion[]
}

export interface Inhabilitacion {
  motivo: string
  horario: string
  cantidadFichas: number
}

export interface DetalleConsultorio {
  id: number
  descripcion: string
  abreviatura: string
  centroMedicoId: number
  estado: boolean
  tipoConsultorio: TipoConsultorio
  tipoConsultorioId: number
  tipoEspecialidad: TipoEspecialidad
  tipoEspecialidadId: number
}

export interface EstadoReserva {
  id?: number
  abreviatura: string
  descripcion: string
  visibilidad: boolean
}
