import { Routes } from '@angular/router'

import { HistorialListComponent } from './pages/historial/historial-list/historial-list.component'
import { MenuServiceComponent } from './pages/menu-service/menu-service.component'
import { ReservaListComponent } from './pages/reserva/reserva-list/reserva-list.component'


export const CITAS_MEDICAS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'menu-service',
        component: MenuServiceComponent,
      },
      {
        path: 'reserva-list',
        component: ReservaListComponent,
      },
      {
        path: 'historial-list',
        component: HistorialListComponent,
      },
    ],
  },
]
