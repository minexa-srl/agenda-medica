import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'

import { AdscripcionTemporal } from 'src/app/modules/asegurado/models/adscripcion-temporal'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AdscripcionTemporalService {
  url = environment.urlApiCitasMedicas
  controller = 'AdscripcionesTemporales'

  constructor(private http: HttpClient) { }

  getByGrupoFamiliarId(grupoFamiliarId: number) {
    return this.http
      .get<AdscripcionTemporal>(`${this.url}/${this.controller}/byGrupoFamiliar/${grupoFamiliarId}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
