/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class HorasService {
  uri: string;
  controller = 'horas';
  constructor(private http: HttpClient) {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`;
  }

  getByConsultorio(consultorioId: number, medicoUsuarioId: string, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/horasByConsultorio/${consultorioId}/${medicoUsuarioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map((response) =>
          response.map((x) => ({
            ...x,
            horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
          }))
        )
      );
  }
}