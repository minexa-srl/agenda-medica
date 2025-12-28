export const environment = {
  //#region Configuración del Proyecto
  production: true,
  debug: false,
  api: 'https://api-desarrollo.cns.gob.bo',
  apiVersion: 'v1',
  apiAuth: 'https://api-desarrollo.cns.gob.bo/auth',
  staticMenu: false,
  //#endregion

  //#region Configuración de APIs
  urlApi: 'https://api-desarrollo.cns.gob.bo/erpcns/v1',
  urlApiVigencia: 'https://api-desarrollo.cns.gob.bo/api/vg/v1',
  urlApiCitasMedicas: 'https://api-desarrollo.cns.gob.bo/CitasMedicas/v1',
  citaMedicaApi: 'http://localhost:5002', // solo desarrollo
  //#endregion

  //#region Configuración de OAuth
  clientId: 'test_dev',
  responseType: 'code',
  redirectUri: '/auth-callback',
  postLogoutRedirectUri: '/login',
  scope: 'openid profile offline_access API_Example api.read adminClient_api',
  showDebugInformation: false,
  clearHashAfterLogin: false,
  sessionChecksEnabled: false,
  nonceStateSeparator: 'semicolon',
  useSilentRefresh: false,
  theme: 'layout-cns-nacional',
  //#endregion
};
