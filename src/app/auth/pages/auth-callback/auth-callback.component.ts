import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private stream: Subscription = new Subscription()

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.stream = this.authService.canActivateProtectedRoutes$.subscribe(isAuthorized => {
      if (isAuthorized) {
        this.router.navigate(['/admin'])
      } else {
        this.router.navigate(['/login'])
      }
    })
  }
}
