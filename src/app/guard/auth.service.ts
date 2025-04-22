import { Injectable } from "@angular/core";
import { PermissoesLogin } from "../models/permissoesLogin";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    private permissoesLogin!: PermissoesLogin;

    isLoggedIn(): boolean {
      return !!this.permissoesLogin;
    }

    setLogin(permissoesLogin: PermissoesLogin): void {
      permissoesLogin.listCdFuncao = permissoesLogin.cdFuncao.split('|').map(cdf => Number(cdf));
      this.permissoesLogin = permissoesLogin;
    }

    getLogin(): PermissoesLogin {
      return this.permissoesLogin;
    }

    logout(): void {
      this.permissoesLogin = undefined!;
    }
  }