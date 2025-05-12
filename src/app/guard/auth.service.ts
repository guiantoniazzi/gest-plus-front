import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PermissoesLogin } from '../models/permissoesLogin';
import { DEFAULT_ROTAS, Rotas } from '../models/rotas';
import { Funcionalidade } from '../enum/funcionalidade';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private permissoesLogin!: PermissoesLogin;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Restaurar o estado do login apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedLogin = window.sessionStorage.getItem('permissoesLogin');
      if (savedLogin) {
        this.permissoesLogin = JSON.parse(savedLogin);
      }
    }
  }

  setLogin(permissoes: PermissoesLogin): void {
    this.permissoesLogin = permissoes;
    // Salvar no sessionStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('permissoesLogin', JSON.stringify(permissoes));
    }
  }

  getLogin(): PermissoesLogin {
    return this.permissoesLogin;
  }

  logout(): void {
    this.permissoesLogin = undefined!;
    // Remover do sessionStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('permissoesLogin');
    }
    
  }

  verificaNavegacao(rota: Rotas): boolean {
    if (!this.permissoesLogin) {
      return false;
    }
    return rota.acesso.some(
      (func) => func == Funcionalidade[''] || this.permissoesLogin.empresa.map(emp => emp.cdFuncao.includes(func)).includes(true)
    );
  }

  isLoggedIn(link: string): boolean {
    const rota = DEFAULT_ROTAS.find((r) => r.link == link);
    if (!rota) {
      return false;
    }
    return this.verificaNavegacao(rota);
  }

  verificaPermissaoPara(link: string, permissao: number): boolean {
    const rota = DEFAULT_ROTAS.find((r) => r.link == link && r.acesso.includes(permissao));
    if (!rota) {
      return false;
    }
    return this.verificaNavegacao(rota);
  }
}