import { Routes } from '@angular/router'

import { AyudaListComponent } from './pages/ayuda/ayuda-list/ayuda-list.component'
import { CentroMedicoListComponent } from './pages/centro-medico/centro-medico-list/centro-medico-list.component'


export const INFORMACION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'centro-medico-list',
        component: CentroMedicoListComponent,
      },
      {
        path: 'ayuda-list',
        component: AyudaListComponent,
      },
    ],
  },
]
