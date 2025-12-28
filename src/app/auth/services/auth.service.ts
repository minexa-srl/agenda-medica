import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';
import { authConfig } from '../config/auth-config';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map(values => values.every(b => b)));

  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.configure(authConfig);

    // Eventos para debugging
    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent Object:', event);
      }
    });

    window.addEventListener('storage', event => {
      if (event.key !== 'access_token' && event.key !== null) return;
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
      if (!this.oauthService.hasValidAccessToken()) this.navigateToLoginPage();
    });

    this.oauthService.events.subscribe(() => {
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
    });
    this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(() => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
      .subscribe(() => this.navigateToLoginPage());

    // ⚡ Comentar o eliminar si no quieres refresh automático
    // this.oauthService.setupAutomaticSilentRefresh();
  }

  // Getters
  public get accessToken() { return this.oauthService.getAccessToken(); }
  public get refreshToken() { return this.oauthService.getRefreshToken(); }
  public get identityClaims() { return this.oauthService.getIdentityClaims(); }
  public get idToken() { return this.oauthService.getIdToken(); }
  public get logoutUrl() { return this.oauthService.logoutUrl; }

  // ⚡ Método principal de login inicial adaptado a endpoints fijos
  public runInitialLoginSequence(): Promise<void> {
    return this.oauthService.tryLoginCodeFlow().then(() => {
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
      this.isDoneLoadingSubject$.next(true);

      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.initCodeFlow(); // Redirige al login si no hay token
      }
    }).catch(err => {
      console.error('Error in initial login sequence:', err);
      this.isDoneLoadingSubject$.next(true);
    });
  }

  // Métodos de login/logout
  public login(targetUrl?: string) {
    this.oauthService.initLoginFlow(targetUrl || this.router.url);
  }

  public logout() {
    this.oauthService.logOut();
  }

  public refresh() {
    this.oauthService.silentRefresh();
  }

  public hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }

  private navigateToLoginPage() {
    this.router.navigateByUrl('/should-login');
  }
}
