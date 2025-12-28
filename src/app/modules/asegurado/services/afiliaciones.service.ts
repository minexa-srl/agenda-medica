import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'

import { environment } from 'src/environments/environment'

import { BeneficiarioDeclaracion } from '../models/beneficiario-declaracion'
import { Regularizacion } from '../models/regularizacion'
import { TrabajorExistencia } from '../models/trabajor-existencia'

@Injectable({
  providedIn: 'root',
})
export class AfiliacionesService {
  url = environment.urlApi
  controller = 'Afiliaciones/Trabajadores'

  constructor(private http: HttpClient) { }

  getListRegularizaciones(titularId: number) {
    return this.http
      .get<Regularizacion[]>(`${this.url}/${this.controller}/Beneficiario?TitularId=${titularId}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getDeclaracion(datos: object) {
    return this.http
      .get<BeneficiarioDeclaracion[]>(`${this.url}/${this.controller}/BeneficiarioDeclaracion`, {
        ...{ params: datos as HttpParams },
      })
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getVerificar(
    ci: string,
    paterno: string,
    materno: string,
    nombres: string,
    fechaNacimiento: string,
    genero: string,
  ) {
    return this.http
      .get<
        TrabajorExistencia[]
      >(`${this.url}/${this.controller}/Existencia?DocumentoIdentidad=${ci}&Paterno=${paterno}&Materno=${materno}&Nombres=${nombres}&FechaNacimiento=${fechaNacimiento}&Sexo=${genero}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  postBeneficiario(beneficiario: object) {
    return this.http.post<number>(`${this.url}/${this.controller}/Beneficiario`, beneficiario).pipe(
      map(response => {
        return response
      }),
    )
  }

  postBeneficiarioDeclaracion(data: object) {
    return this.http
      .post<number>(`${this.url}/${this.controller}/BeneficiarioDeclaracion`, data)
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
