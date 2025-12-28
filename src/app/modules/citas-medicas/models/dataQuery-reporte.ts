export interface DataQueryReporte {
  aseguradoId?: number
  regional?: string
  centroMedico?: string
  consultorio?: any
  paciente: string
  medico: string
  fechaReserva: string | null
  ficha?: number
  horaInicio?: string
  horaFin?: string
  usuario?: string
}
