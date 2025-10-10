import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Empresa, PermissoesLogin } from '../models/permissoesLogin';
import { DEFAULT_ROTAS, Rotas } from '../models/rotas';
import { Funcionalidade } from '../enum/funcionalidade';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private permissoesLogin!: PermissoesLogin;
  public empresaSelected!: Empresa;

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
    this.empresaSelected = this.permissoesLogin.empresa[0];
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
      (func) => func == Funcionalidade[''] || this.empresaSelected?.cdFuncao?.includes(func)
    );
  }

  verificaRedirect(link: string): boolean {
    const rota = DEFAULT_ROTAS.find((r) => r.link == link);
    if (!rota) {
      return false;
    }
    if (!this.verificaNavegacao(rota)) {
      return false;
    }
    return true;
  }

  isLoggedIn(link: string): boolean {
    const rota = DEFAULT_ROTAS.find((r) => r.link == link);
    if (!rota) {
      return false;
    }
    return this.verificaNavegacao(rota);
  }

  verificaPermissaoParaFuncaoNaEmpresa(funcao: Funcionalidade): boolean {
    return this.permissoesLogin.empresa.some((emp) => emp.cdEmpresa == this.empresaSelected.cdEmpresa && emp.cdFuncao.includes(funcao));
  }
}