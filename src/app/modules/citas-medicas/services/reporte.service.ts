/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { DataQueryReporte } from '../models/dataQuery-reporte';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  constructor(
    private pipe: DatePipe,
    private sanitizer: DomSanitizer) { }

  async generateReportFicha(data: DataQueryReporte): Promise<SafeResourceUrl> {
    console.log('data', data)

    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(' ', '').replace('.', '');
    const docDefinition = {
      content: [
        {
          columns: [
            {
              text: `CAJA NACIONAL DE SALUD - ${data.regional}\n${data.centroMedico}`,
              bold: false,
              fontSize: 9,
              alignment: 'center',
              margin: [0, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: data.consultorio?.descripcion ?? '',
              bold: true,
              fontSize: 10,
              alignment: 'center',
              margin: [0, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: `MÉDICO: ${data.medico}`,
              fontSize: 9,
              alignment: 'center',
              margin: [0, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: `${data.consultorio.abreviatura} - ${data.ficha}`,
              bold: true,
              fontSize: 30,
              alignment: 'center',
              margin: [0, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: 'Fecha Atención: ', style: 'prompt' },
                { text: this.pipe.transform(data.fechaReserva, 'dd/MM/yyyy'), style: 'value' }
              ],
              fontSize: 9,
              alignment: 'left',
              margin: [5, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: 'Hora Atención: ', style: 'prompt' },
                { text: data.horaInicio, style: 'value' },
              ],
              fontSize: 9,
              alignment: 'left',
              margin: [5, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: 'Paciente: ', style: 'prompt' },
                { text: `${data.paciente}`, style: 'value' },
              ],
              fontSize: 9,
              alignment: 'left',
              margin: [5, 0, 0, 0],
            },
          ],
        },

        {
          margin: [0, 2, 0, 0],
          columns: [
            {
              margin: [0, 5, 0, 0],
              width: '70%',
              layout: {
                hLineWidth: function () {
                  return 0;
                },
                vLineWidth: function () {
                  return 0;
                },
              },
              table: {
                body: [
                  [
                    {
                      text: 'La hora de atención programada es referencial, asista minimamente 30 min antes de su atención.',
                      style: 'footer',
                      alignment: 'center',

                    },
                  ],
                  [
                    {
                      text: `CNS AGENDA-MEDICA`,
                      style: 'firm',
                      alignment: 'left',
                    },
                  ],
                  [
                    {
                      text: `Programado por: ${data.usuario} - ${this.pipe.transform(new Date(), 'dd/MM/yyyy')} ${formattedTime}`,
                      style: 'firm',
                      alignment: 'left',
                    },
                  ],
                ],
              },
            },
            {
              fit: 80,
              qr: `CAJA NACIONAL DE SALUD
              \nConsultorio: ${data.consultorio.descripcion}
              \nPaciente: ${data.paciente}
              \nFecha Atencion: ${this.pipe.transform(data.fechaReserva, 'dd-MM-yyyy')}
              \nHora Atencion: ${data.horaInicio}`,
            },
          ],
        },
      ],
      styles: {
        header: {
          bold: false,
          fontSize: 16,
        },
        data: {
          bold: false,
          fontSize: 9
        },
        field: {
          fontSize: 9
        },
        footer: {
          bold: false,
          fontSize: 7,
        },
        footer_emergencia: {
          bold: false,
          fontSize: 9,
        },
        firm: {
          bold: false,
          fontSize: 5,
        },
        prompt: {
          bold: false,
          fontSize: 8,
        },
        value: {
          bold: true,
          fontSize: 9,
        },
        cod1: { color: 'gray', fontSize: 9 },
      },
      pageSize: {
        width: 226.8,
        height: 256.772
      },
      pageMargins: [4.252, 20, 4.252, 0]
    };

    return new Promise((resolve) => {
      pdfMake.createPdf(docDefinition as any).getBlob((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        resolve(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
      });
    });
  }
}
