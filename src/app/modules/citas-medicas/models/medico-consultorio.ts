import { Reservas } from "src/app/modules/citas-medicas/models/reservas"

import { Hora } from "./hora"

export interface MedicoConsultorio {
  centroMedicoId: number
  consultorioId: number
  documento: string
  horarios: Horario[]
  horasDisponibles?: HoraDisponible[]
  medicoUsuarioId: string
  nombres: string
}

export interface Horario {
  consultorioId: number
  descripcion: string
  diasAtencion: number[]
  horaInicio: string
  medicoUsuarioId: string
  turno: number
}

export interface HoraDisponible {
  id?: number
  consultorioHorarioId: number
  descripcion: string
  diasAtencion: number[]
  estado: boolean
  horaDisponible: string
  horaFin: string
  horaFinDetalle: string
  horaInicio: string
  horaInicioDetalle: string
  horas: Hora[]
  horasReservadas: Reservas[]
  intervalo: number
  numeroFichas: number
  numeroFichasAdicionales: number
  pacientesPorHora: number

}
