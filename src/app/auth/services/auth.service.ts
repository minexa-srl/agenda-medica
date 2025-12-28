import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc'
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false)
  public isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false)
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable()
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable()

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
  ]).pipe(map(values => values.every(b => b)))

  constructor(
    private oauthService: OAuthService,
    private router: Router,
  ) {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event)
      } else {
        console.warn('OAuthEvent Object:', event)
      }
    })

    window.addEventListener('storage', event => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated',
      )
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken())

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage()
      }
    })

    this.oauthService.events.subscribe(() => {
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken())
    })
    this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken())

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(() => this.oauthService.loadUserProfile())

    this.oauthService.events
      .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
      .subscribe(() => this.navigateToLoginPage())

    this.oauthService.setupAutomaticSilentRefresh() // Simplemente comentá o eliminá esa línea si no querés que el refresh token esté habilitado.
  }

  public get accessToken() {
    return this.oauthService.getAccessToken()
  }

  public get refreshToken() {
    return this.oauthService.getRefreshToken()
  }

  public get identityClaims() {
    return this.oauthService.getIdentityClaims()
  }

  public get idToken() {
    return this.oauthService.getIdToken()
  }

  public get logoutUrl() {
    return this.oauthService.logoutUrl
  }

  public runInitialLoginSequence(): Promise<void> {
    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken())
        this.isDoneLoadingSubject$.next(true)
      })
      .catch(err => {
        console.error('Error loading discovery document or trying login:', err)
        this.isDoneLoadingSubject$.next(true)
      })
  }

  public login(targetUrl?: string) {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    this.oauthService.initLoginFlow(targetUrl || this.router.url)
  }

  public logout() {
    // this.oauthService.revokeTokenAndLogout();
    this.oauthService.logOut()
  }

  public refresh() {
    this.oauthService.silentRefresh()
  }

  public hasValidToken() {
    return this.oauthService.hasValidAccessToken()
  }

  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.router.navigateByUrl('/should-login')
  }
}
