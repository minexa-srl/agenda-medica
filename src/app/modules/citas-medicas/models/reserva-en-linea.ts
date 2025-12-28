export interface ReservaEnLinea {
  fechaReserva: string | null
  observaciones: string
  horaId: number
  aseguradoId: number
  consultorioHorarioId: number
  medicoUsuarioId: string
  estadoReservaId: number
  fuenteRegistroId: number
  consultorioAdscritoId: number
  grupoFamiliarId: number
  tipoReserva: number
  isNuevo: boolean
}
