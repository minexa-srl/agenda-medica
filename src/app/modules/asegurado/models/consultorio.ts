export interface Consultorio {
  id: number
  abreviatura: string
  descripcion: string
  estado: true
  centroMedicoId: number
  tipoConsultorioId: number
  tipoEspecialidadId: number
  tipoConsultorio: TipoConsultorio
  tipoEspecialidad: TipoEspecialidad
}

export interface TipoConsultorio {
  id: number
  descripcion: string
  abreviatura: string
}

export interface TipoEspecialidad {
  id: number
  descripcion: string
  abreviatura: string
}
