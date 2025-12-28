import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, tap, throwError } from 'rxjs'

import { environment } from 'src/environments/environment'

import { AuthService } from '../services/auth.service'
import { LoadingService } from '../services/loading.service'
import { NotificationService } from '../services/notification.service'

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const notificationService = inject(NotificationService)
  const loadingService = inject(LoadingService)

  if (shouldBypassUrl(req.url)) {
    return next(req)
  }

  loadingService.show(getLoadingMessage(req.method))
  const clonedRequest = addAuthorizationHeader(req, authService.accessToken)

  return next(clonedRequest).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        loadingService.hide()
      }
    }),
    catchError((error: unknown) => {
      loadingService.hide()

      if (error instanceof HttpErrorResponse) {
        handleHttpError(error, notificationService)
      } else {
        handleGenericError(error, notificationService)
      }
      return throwError(() => error)
    }),
  )
}
//#region  Funciones auxiliares
const addAuthorizationHeader = (req: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  })
}

const shouldBypassUrl = (url: string): boolean => {
  return [environment.issuer].some(u => url.startsWith(u))
}

const getLoadingMessage = (method: string): string => {
  const messages: Record<string, string> = {
    GET: 'Obteniendo información...',
    POST: 'Guardando información...',
    PUT: 'Actualizando información...',
    DELETE: 'Eliminando información...',
  }
  return messages[method] || 'Procesando...'
}

const handleHttpError = (
  error: HttpErrorResponse,
  notificationService: NotificationService,
): void => {
  const status = error.status
  const message = status < 500 ? getClientErrorMessage(status) : getServerErrorMessage(status)

  // Mostrar el mensaje de error amigable y el código si no estamos en producción
  const fullMessage = environment.production ? message : `${message} (Código: ${status})`

  if (status >= 400 && status < 500) {
    notificationService.showWarn(`Advertencia!!`, fullMessage)
  } else if (status >= 500 && status <= 599) {
    notificationService.showError(`Error!!`, fullMessage)
  }
}

const handleGenericError = (error: unknown, notificationService: NotificationService): void => {
  let errorMessage = 'Error desconocido'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = (error as { message: string }).message
  }
  notificationService.showError('¡Ocurrió un Error!', errorMessage, 20000)
}

const getClientErrorMessage = (status: number): string => {
  const clientErrorMessages: Record<number, string> = {
    400: 'Solicitud incorrecta. Verifica los datos ingresados.',
    401: 'No autorizado. Debes iniciar sesión.',
    403: 'Acceso denegado. No tienes permiso para acceder a este recurso.',
    404: 'Recurso no encontrado. Verifica la URL.',
    405: 'Método no permitido en este recurso.',
    408: 'Tiempo de espera agotado. Inténtalo nuevamente más tarde.',
    422: 'Los datos enviados no son válidos. Por favor, revisa los campos y vuelve a intentarlo.',
    429: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
  }
  return clientErrorMessages[status] || 'Error en la solicitud. Por favor, inténtalo nuevamente.'
}

const getServerErrorMessage = (status: number): string => {
  const serverErrorMessages: Record<number, string> = {
    500: 'Error en el servidor. Por favor, intente más tarde.',
    502: 'Error en la conexión con el servidor. Intente nuevamente.',
    503: 'El servicio no está disponible en este momento. Intente más tarde.',
    504: 'Tiempo de espera agotado en la conexión con el servidor. Intente de nuevo.',
  }
  return serverErrorMessages[status] || 'Error en el servidor. Inténtelo nuevamente más tarde.'
}
//#endregion
