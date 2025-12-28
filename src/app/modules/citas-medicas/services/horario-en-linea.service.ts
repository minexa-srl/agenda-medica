/* SERVICE HORARIO-EN-LINEA
========================================== */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment'

import { HorarioEnLinea } from '../models/horario-en-linea';

@Injectable({
  providedIn: 'root',
})
export class HorarioEnLineaService {
  uri: string;
  controller = 'HorarioEnLinea';
  constructor(private http: HttpClient) {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`;
  }

  getLastByCentroMedicoId(centroMedicoId: number) {
    return this.http.get<HorarioEnLinea>(`${this.uri}/${centroMedicoId}`);
  }
}
