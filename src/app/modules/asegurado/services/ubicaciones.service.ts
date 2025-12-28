import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'

import { environment } from 'src/environments/environment'

import { Regional } from '../../informacion/models/regional'
import { Zonificacion } from '../models/zonificacion'

@Injectable({
  providedIn: 'root',
})
export class UbicacionesService {
  url = environment.urlApi
  controller = 'Ubicaciones'

  constructor(private http: HttpClient) { }

  getZonificacion(nivelId: number) {
    return this.http
      .get<Zonificacion[]>(`${this.url}/${this.controller}/Zonificacion?Nivel=${nivelId}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getRegionales(dataQuery: object) {
    return this.http.get<Regional[]>(`${this.url}/${this.controller}/RegionalesDistritales`, { params: dataQuery as HttpParams });
  }

}
