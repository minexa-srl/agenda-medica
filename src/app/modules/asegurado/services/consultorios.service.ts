import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'

import { environment } from 'src/environments/environment'

import { Consultorio } from '../models/consultorio'

@Injectable({
  providedIn: 'root',
})
export class ConsultoriosService {
  url = environment.urlApiVigencia
  controller = 'Consultorios'

  constructor(private http: HttpClient) { }

  getById(id: number) {
    return this.http.get<Consultorio>(`${this.url}/${this.controller}/${id}`).pipe(
      map(response => {
        return response
      }),
    )
  }

  getConsultorios(centroMedicoId: number) {
    return this.http
      .get<Consultorio[]>(`${this.url}/${this.controller}?centroMedicoId=${centroMedicoId}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
