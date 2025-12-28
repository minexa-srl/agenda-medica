import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Reservas } from 'src/app/modules/citas-medicas/models/reservas';
import { environment } from 'src/environments/environment.development';

import { DataQueryHorasReservadas } from '../models/dataQuery-horasReservadas';
import { DataQueryReservasHistorial } from '../models/dataQuery-reservasHistorial';
import { DataQueryReservasPendientes } from '../models/dataQuery-reservasPendientes';
import { ReservaEnLinea } from '../models/reserva-en-linea';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  uri: string;
  controller = 'Reservas';
  constructor(private http: HttpClient) {

    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`;
  }

  getPendientesByAsegurado(dataQuery: DataQueryReservasPendientes) {
    const params = new HttpParams()
      .set('aseguradoId', dataQuery.aseguradoId)
      .set('estadoReservaId', dataQuery.estadoReservaId);
    return this.http.get<Reservas[]>(`${this.uri}/byAseguradoForEnLinea`, { params });
  }

  getHistorialByAsegurado(dataQuery: DataQueryReservasHistorial) {
    const params = new HttpParams()
      .set('aseguradoId', dataQuery.aseguradoId)
    return this.http.get<Reservas[]>(`${this.uri}/all/byAseguradoForEnLinea`, { params });
  }

  getByConsultorioHorario(dataQuery: DataQueryHorasReservadas) {
    console.log('param', dataQuery)
    const params = new HttpParams()
      .set('consultorioHorarioId', dataQuery.consultorioHorarioId)
      .set('fechaReserva', dataQuery.fechaReserva);
    let re = this.http.get<Reservas[]>(`${this.uri}/byConsultorioHorario`, { params });
    console.log('response', re)
    return re
  }

  post(data: ReservaEnLinea) {
    return this.http.post(`${this.uri}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.uri}/${id}`);
  }
}
