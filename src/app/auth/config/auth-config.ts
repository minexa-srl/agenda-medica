import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const authConfig: AuthConfig = {
  loginUrl: 'https://auth-desarrollo.cns.gob.bo/oauth2/authorize',
  tokenEndpoint: 'https://auth-desarrollo.cns.gob.bo/oauth2/token',
  userinfoEndpoint: 'https://auth-desarrollo.cns.gob.bo/oauth2/userinfo',
  logoutUrl: 'https://auth-desarrollo.cns.gob.bo/oauth2/logout',

  clientId: environment.clientId,
  responseType: environment.responseType,
  redirectUri: environment.redirectUri, // apunta al callback permitido
  silentRefreshRedirectUri: environment.silentRefreshRedirectUri,
  postLogoutRedirectUri: `${window.location.origin}${environment.postLogoutRedirectUri}`,
  scope: environment.scope,

  strictDiscoveryDocumentValidation: false,
  showDebugInformation: environment.showDebugInformation,
  clearHashAfterLogin: environment.clearHashAfterLogin,
  sessionChecksEnabled: environment.sessionChecksEnabled,
  nonceStateSeparator: environment.nonceStateSeparator,
  useSilentRefresh: environment.useSilentRefresh,
};
