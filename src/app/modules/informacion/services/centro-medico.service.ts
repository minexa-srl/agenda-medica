import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';

import { CentroMedico } from '../models/centro-medico';

@Injectable({
  providedIn: 'root',
})
export class CentroMedicoService {
  uri: string;
  controller = 'CentrosMedicos';
  constructor(private http: HttpClient) {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`;
  }

  getById(id: number) {
    return this.http.get<CentroMedico>(`${this.uri}/${id}`);
  }

  getAllCentros() {
    return this.http.get<CentroMedico[]>(`${this.uri}/all`);
  }
}
