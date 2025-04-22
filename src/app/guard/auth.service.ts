import { inject, Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { PermissoesLogin } from "../models/permissoesLogin";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private cookieService = inject(CookieService);

    private permissoesLogin!: PermissoesLogin;

    isLoggedIn(): boolean {
      return !!this.cookieService.get('tokenf');
    }

    setLogin(permissoesLogin: PermissoesLogin): void {
      this.permissoesLogin = permissoesLogin;
    }

    getLogin(): PermissoesLogin {
      return this.permissoesLogin;
    }
  }