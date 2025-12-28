/* CONTROLLER CENTRO-MEDICO-DETAIL
============================================ */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { CentroMedico } from '../../../models/centro-medico';
import { LeafletIcon } from '../../../models/LeafletIcon';

@Component({
  selector: 'app-centro-medico-detail',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ButtonModule],
  templateUrl: './centro-medico-detail.component.html',
  styleUrl: './centro-medico-detail.component.css'
})

export class CentroMedicoDetailComponent {

  /* ATTRIBUTES
  -------------------------*/
  centroMedico!: CentroMedico;
  state!: boolean;
  map!: L.Map;

  /* METHODS
  -------------------------*/
  show(centroMedico: CentroMedico) {
    this.centroMedico = centroMedico;
    this.state = true;

    delete (L.Icon.Default.prototype as LeafletIcon)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/images/leaflet/marker-icon.png',
      shadowUrl: 'assets/images/leaflet/marker-shadow.png',
    });
    setTimeout(() => this.initMap(), 0);
  }

  close() {
    this.state = false;
  }

  initMap() {
    if (!this.centroMedico || !this.centroMedico.latitud || !this.centroMedico.longitud) return;
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map').setView([this.centroMedico.latitud, this.centroMedico.longitud], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    L.marker([this.centroMedico.latitud, this.centroMedico.longitud])
      .addTo(this.map)
      .bindPopup(`<b>${this.centroMedico.descripcion}</b><br>${this.centroMedico.direccion}`)
      .openPopup();
  }
}
