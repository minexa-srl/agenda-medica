export interface CentroMedico {
  id?: number
  codigo: "01"
  abreviatura: string
  descripcion: string
  direccion: string
  latitud: number
  longitud: number
  nivelAtencionId: number
  numeroCentro: number
  tipoCentroMedicoId: number
  ubicacionId: number
  ubicacionRegionalId: number
  eliminacionReservas: boolean
  estado: number
}