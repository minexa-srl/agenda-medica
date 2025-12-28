import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment'

import { DataQueryCentroMedico } from '../models/dataQuery-centroMedico';
import { MedicoConsultorio } from '../models/medico-consultorio';

@Injectable({
  providedIn: 'root'
})
export class KardexService {
  uri: string;
  controller = 'Kardex';
  constructor(private http: HttpClient) {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`;
  }

  getConsultorioMedicos(dataQuery: DataQueryCentroMedico) {
    const params = new HttpParams()
      .set('centroMedicoId', dataQuery.centroMedicoId);
    return this.http.get<MedicoConsultorio[]>(`${this.uri}/consultorio-medicos`, { params });
  }
}
