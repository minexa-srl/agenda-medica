export interface AdscripcionTemporal {
  id: number
  grupoFamiliarId: number
  aseguradoId: number
  ubicacionRegionalId: number
  centroMedicoId: number
  consultorioId: number
  isValidado: boolean
  isReasignado: boolean
  consultorioReasignadoId: number
  estado: boolean
  fechaValidacion: Date
  asegurado: Asegurado
}
export interface Asegurado {
  usuarioCreacion: string
  fechaCreacion: Date
  hostCreacion: string
  usuarioModificacion: string
  fechaModificacion: Date
  hostModificacion: string
  estadoRegistro: true
  aseguradoId: number
  personaId: number
  nombres: string
  paterno: string
  materno: string
  documentoIdentidad: string
  matricula: string
  extencion: string
  sexo: string
  fechaNacimiento: Date
  tipoParentesco: string
  parametroTipoParentescoId: string
  estado: string
  direccion: string
  descripcion: string
  grupoFamiliarId: number
}
