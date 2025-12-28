export const environment = {
  //#region Configuracion Proyecto
  production: false, // Cambiar a true en producción
  debug: true, // Desactívalo en producción para evitar sobrecarga de la consola
  api: 'https://api-desarrollo.cns.gob.bo',
  apiVersion: 'v1',
  apiAuth: 'https://api-desarrollo.cns.gob.bo/auth',
  staticMenu: true, // Si es solo para desarrollo, asegúrate de desactivar esta funcionalidad en producción
  //#endregion
  //#region Configuracion APIS
  urlApi: 'https://api-desarrollo.cns.gob.bo/erpcns/v1',
  // urlApiVigencia: 'https://api-desarrollo.cns.gob.bo/Vigencia/v1', (FALLA)
  urlApiVigencia: 'https://api-desarrollo.cns.gob.bo/api/vg/v1', // (FUNCIONA)

  urlApiCitasMedicas: 'https://api-desarrollo.cns.gob.bo/CitasMedicas/v1',
  citaMedicaApi: 'http://localhost:5002',
  vigenciaApi: 'https://api-desarrollo.cns.gob.bo/api/vg',
  //#endregion
  //#region Configuración de OAuth
  issuer: 'https://auth-desarrollo.cns.gob.bo',
  clientId: 'test_dev',
  responseType: 'code',
  redirectUri: '/auth-callback',
  silentRefreshRedirectUri: '/silent-refresh.html',
  scope: 'openid profile offline_access API_Example api.read adminClient_api',
  postLogoutRedirectUri: '/login',
  useSilentRefresh: false,
  sessionChecksEnabled: false,
  showDebugInformation: false,
  clearHashAfterLogin: false,
  nonceStateSeparator: 'semicolon',
  theme: 'layout-cns-nacional',
  //#endregion
}
