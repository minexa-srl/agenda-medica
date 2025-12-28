import { Routes } from '@angular/router'

import { BeneficiarioFormComponent } from './pages/beneficiarios/beneficiario-form/beneficiario-form.component'
import { BeneficiariosListComponent } from './pages/beneficiarios/beneficiarios-list/beneficiarios-list.component'
import { PerfilDetailComponent } from './pages/perfil/perfil-detail/perfil-detail.component'

export const ASEGURADO_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'perfil',
        component: PerfilDetailComponent,
      },
      {
        path: 'beneficiario-list',
        component: BeneficiariosListComponent,
      },
      {
        path: 'beneficiario-form',
        component: BeneficiarioFormComponent,
      },
    ],
  },
]
