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

  // 🔑 Configuración OAuth2
  issuer: 'https://auth-desarrollo.cns.gob.bo',
  clientId: 'test_dev',
  responseType: 'code',

  // ⚡ Aquí usamos un redirectUri que ya es válido en el auth
  redirectUri: 'https://auth-desarrollo.cns.gob.bo/oauth2/callback',
  silentRefreshRedirectUri: 'https://auth-desarrollo.cns.gob.bo/oauth2/callback',

  postLogoutRedirectUri: '/login',
  scope: 'openid profile offline_access API_Example api.read adminClient_api',

  useSilentRefresh: false,
  sessionChecksEnabled: false,
  showDebugInformation: false,
  clearHashAfterLogin: false,
  nonceStateSeparator: 'semicolon',
  theme: 'layout-cns-nacional',
};
