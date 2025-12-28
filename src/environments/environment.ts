export const environment = {
  production: true,
  debug: false,
  api: 'https://api-desarrollo.cns.gob.bo',
  apiVersion: 'v1',
  apiAuth: 'https://api-desarrollo.cns.gob.bo/auth',
  staticMenu: false,

  urlApi: 'https://api-desarrollo.cns.gob.bo/erpcns/v1',
  urlApiVigencia: 'https://api-desarrollo.cns.gob.bo/api/vg/v1',
  urlApiCitasMedicas: 'https://api-desarrollo.cns.gob.bo/CitasMedicas/v1',
  citaMedicaApi: 'http://localhost:5002', // solo desarrollo

  issuer: 'https://auth-desarrollo.cns.gob.bo',
  clientId: 'test_dev',
  responseType: 'code',
  redirectUri: '/auth-callback',
  silentRefreshRedirectUri: '/silent-refresh.html',
  postLogoutRedirectUri: '/login',
  scope: 'openid profile offline_access API_Example api.read adminClient_api',
  useSilentRefresh: false,
  sessionChecksEnabled: false,
  showDebugInformation: false,
  clearHashAfterLogin: false,
  nonceStateSeparator: 'semicolon',
  theme: 'layout-cns-nacional',
};
