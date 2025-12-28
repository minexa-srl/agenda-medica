export interface HorarioEnLinea {
  id?: number
  regionalId: number
  centroMedicoId: number
  horaApertura: string
  horaCierre: string
  diasAtencion: number[]
  cantidadFichas: number
  cantidadSancion: number
  rangoHabilitacion: number
  consultorios: Consultorio[]
  estadoRegistro: boolean
}

export interface Consultorio {
  id?: number
  horarioEnLineaId: number
  consultorioId: number
  medicoUsuarioId: string
  horasEnLinea: HoraEnLinea[]
}

export interface HoraEnLinea {
  consultorioHorarioId: number
  horaId: number
}
