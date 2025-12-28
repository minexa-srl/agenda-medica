import { Routes } from '@angular/router'

import { autWithForcedLoginGuard } from './auth/guards/aut-with-forced-login.guard'
import { AuthCallbackComponent } from './auth/pages/auth-callback/auth-callback.component'
import { LoginComponent } from './auth/pages/login/login.component'
import { DashboardComponent } from './modules/dashboard/dashboard.component'
import { AppLayoutComponent } from './modules/layout/app.layout.component'
import { NotfoundComponent } from './modules/notfound/notfound.component'

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [autWithForcedLoginGuard],
    children: [
      { path: 'admin', component: DashboardComponent },
      {
        path: 'asegurado',
        loadChildren: () =>
          import('./modules/asegurado/asegurado.routes').then(m => m.ASEGURADO_ROUTES),
      },
      {
        path: 'citas-medicas',
        loadChildren: () =>
          import('./modules/citas-medicas/citas-medicas.routes').then(m => m.CITAS_MEDICAS_ROUTES),
      },
      {
        path: 'informacion',
        loadChildren: () =>
          import('./modules/informacion/informacion.routes').then(m => m.INFORMACION_ROUTES),
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },

  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
]
