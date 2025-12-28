import { NgFor, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'

import { AppMenuitemComponent } from './app.menuitem.component'
import { AppMenuItem } from '../../models/app-menu-item'
import { LayoutService } from '../../services/app.layout.service'

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  standalone: true,
  imports: [NgFor, NgIf, AppMenuitemComponent],
})
export class AppMenuComponent implements OnInit {
  model: AppMenuItem[] = []

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Inicio',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] }],
      },
      {
        label: 'Asegurado',
        items: [
          {
            label: 'Perfil',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/asegurado/perfil'],
          },
          {
            label: 'Beneficiarios',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/asegurado/beneficiario-list'],
          },
        ],
      },
      {
        label: 'Servicios Disponibles',
        items: [
          {
            label: 'Agenda Médica',
            icon: 'pi pi-fw pi-calendar-clock',
            routerLink: ['/citas-medicas/menu-service'],
          },
          {
            label: 'Centros Médicos',
            icon: 'pi pi-fw pi-map',
            routerLink: ['/informacion/centro-medico-list'],
          },
          {
            label: 'Guía de Uso',
            icon: 'pi pi-fw pi-question-circle',
            routerLink: ['/informacion/ayuda-list'],
          },
        ],
      }
    ]
  }
}
