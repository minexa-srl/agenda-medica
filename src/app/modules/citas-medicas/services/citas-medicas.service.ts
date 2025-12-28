import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'

import { Asegurado } from '../../asegurado/models/asegurado'
import { ConsultorioAsegurado } from '../../asegurado/models/consultorio-asegurado'
import { GrupoFamiliar } from '../../asegurado/models/grupo-familiar'

@Injectable({
  providedIn: 'root',
})
export class CitasMedicasService {
  url = environment.urlApi
  controller = 'CitasMedicas'

  constructor(private http: HttpClient) { }

  getGrupoFamiliarAsegurados(grupoFamiliarId: number, tipoParentesco: number) {
    const params = new HttpParams()
      .set('GrupoFamiliarId', grupoFamiliarId)
      .set('TipoParentesco', tipoParentesco);
    return this.http.get<GrupoFamiliar[]>(`${this.url}/${this.controller}/GetGrupoFamiliarAsegurados`, { params });
  }

  getAsegurado(documentoIdentidad: string, fechaNacimiento: string) {
    const params = new HttpParams()
      .set('DocumentoIdentidad', documentoIdentidad)
      .set('FechaNacimiento', fechaNacimiento);
    return this.http.get<Asegurado>(`${this.url}/${this.controller}/GetAsegurado`, { params });
  }

  getConsultorio(grupoFamiliarId: number) {
    const params = new HttpParams()
      .set('GrupoFamiliarId', grupoFamiliarId);
    return this.http.get<ConsultorioAsegurado>(`${this.url}/${this.controller}/GetConsultorioAsegurado`, { params });
  }
}
