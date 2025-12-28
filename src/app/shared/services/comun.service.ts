/* SERVICE COMUN
================================== */
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class ComunService {

    constructor(private sanitizer: DomSanitizer) { }

    // GET -> FECHA-HORA ACTUAL
    public getFechaHora() {
        return new Date();
    }

    // GET -> HORA ACTUAL
    public getHoraActual(): string {
        const ahora = new Date();
        return ahora.toTimeString().split(' ')[0]; // "HH:mm:ss"
    }

    // GET ->FECHA ACTUAL    
    public getFecha(): Date {
        return this.normalizeDate(new Date()); // Fecha actual (00:00:00)
    }

    // GET -> PRIMER DIA DEL MES
    public getFechaInicio() {
        const now = new Date();
        return this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }

    // GET ->FECHA ACTUAL
    public getFechaFin() {
        return this.formatDate(new Date());
    }

    // PREPARE -> REPORT PDF
    public formatPDF(reportBase64: string) {
        const pdfData = atob(reportBase64); // Decodifica la cadena base64
        const byteArray = new Uint8Array(pdfData.length);
        for (let i = 0; i < pdfData.length; i++) {
            byteArray[i] = pdfData.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    }

    // VERIFICA SI LA IMG ES BASE 64
    public isBase64(str: string | null | undefined): boolean {
        if (!str) return false;
        try {
            return btoa(atob(str)) === str; // valida que sea un base64 bien formado
        } catch (err) {
            return false;
        }
    }

    // FORMAT -> FECHA
    private formatDate(fecha: Date): string {
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // NORMALIZE -> FECHA
    private normalizeDate(date: Date): Date {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
    }
}
