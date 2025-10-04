// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn(this.router.getCurrentNavigation()?.finalUrl?.toString()!)) {
      return true;
    } else {
      if (!!this.authService.getLogin()) {
        this.router.navigate(['/home']);
        return true;
      }
      else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}