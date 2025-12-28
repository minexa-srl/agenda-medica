/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ParametricasService {
  uri: string;
  controller: string = 'Parametricas';
  constructor(private http: HttpClient) {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`;
  }

  getTipoCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoCentroMedico`, {
      params: dataQuery as HttpParams,
    });
  }

  getTipoConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoConsultorio`, {
      params: dataQuery as HttpParams,
    });
  }

  getTipoEspecialidad(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoEspecialidad`, {
      params: dataQuery as HttpParams,
    });
  }
}
