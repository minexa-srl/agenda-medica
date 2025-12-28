import { OAuthModuleConfig } from 'angular-oauth2-oidc';

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['https://api-desarrollo.cns.gob.bo'],
    sendAccessToken: true,
  },
};
