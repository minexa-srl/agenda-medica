import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'

import { environment } from 'src/environments/environment'

import { Parametro } from '../models/parametro'

@Injectable({
  providedIn: 'root',
})
export class ErpParametrosService {
  url = environment.urlApi
  controller = 'Parametros'

  constructor(private http: HttpClient) { }

  getParametros(parametroId: number, notIn: string) {
    return this.http
      .get<Parametro[]>(`${this.url}/${this.controller}/Parametros?ParametroId=${parametroId}&NotIn=${notIn}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
