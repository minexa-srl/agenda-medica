import { DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideServiceWorker } from '@angular/service-worker'
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage,
  provideOAuthClient,
} from 'angular-oauth2-oidc'
import { MessageService } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'

import { routes } from './app.routes'
import { authConfig } from './auth/config/auth-config'
import { authAppInitializerFactory } from './auth/config/auth-initializer'
import { authModuleConfig } from './auth/config/auth-module-config'
import { storageFactory } from './auth/config/storage-factory'
import { jwtInterceptor } from './auth/interceptors/jwt.interceptor'
import { AuthService } from './auth/services/auth.service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    importProvidersFrom([BrowserAnimationsModule, ReactiveFormsModule, OAuthModule.forRoot()]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: authAppInitializerFactory,
      deps: [AuthService],
      multi: true,
    },
    { provide: AuthConfig, useValue: authConfig },
    { provide: OAuthModuleConfig, useValue: authModuleConfig },
    { provide: OAuthStorage, useFactory: storageFactory },
    MessageService,
    DialogService,
    DatePipe,
  ],
}
