import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { PrimeNGConfig } from 'primeng/api'
import { Observable } from 'rxjs'

import { AuthService } from './auth/services/auth.service'
import { AppConfig, LayoutService } from './shared/services/app.layout.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isAuthenticated: Observable<boolean> | undefined
  isDoneLoading: Observable<boolean> | undefined
  canActivateProtectedRoutes: Observable<boolean> | undefined

  constructor(
    private primengConfig: PrimeNGConfig,
    private layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
  ) {}

  get hasValidToken(): boolean {
    return this.authService.hasValidToken()
  }

  get accessToken(): string {
    return this.authService.accessToken
  }

  get refreshToken(): string {
    return this.authService.refreshToken
  }

  get identityClaims() {
    return this.authService.identityClaims
  }

  get idToken(): string {
    return this.authService.idToken
  }

  ngOnInit(): void {
    const config: AppConfig = {
      ripple: false,
      inputStyle: 'outlined',
      menuMode: 'static',
      colorScheme: 'dark',
      theme: 'tailwind-light',
      scale: 14,
    }
    this.layoutService.config.set(config)
    this.authService.runInitialLoginSequence()
    this.setupRouterScrollReset()
  }

  login(): void {
    this.authService.login()
  }

  logout(): void {
    this.authService.logout()
  }

  refresh(): void {
    this.authService.refresh()
  }

  reload(): void {
    window.location.reload()
  }

  clearStorage(): void {
    localStorage.clear()
  }

  logoutExternally(): void {
    window.open(this.authService.logoutUrl)
  }

  getUser() {
    return this.authService.identityClaims as { document?: string; birthdate?: string } | null
  }

  private setupRouterScrollReset(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0)
      }
    })
  }
}
