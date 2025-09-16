import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { FuncoesSistema } from '../../models/funcoesSistema';
import { AuthService } from '../../guard/auth.service';
import { Pessoa } from '../../models/pessoa';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);

  public usuarioAlteracao?: Usuario;

  constructor(private authService: AuthService) {}

  getPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(
      `${environment.apiBaseUrl}${environment.endpoints.pessoas.getPessoas}`,
      {
        withCredentials: true,
      }
    );
  }

  getEmpresas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(
      `${environment.apiBaseUrl}${environment.endpoints.pessoas.getEmpresas}`,
      {
        withCredentials: true,
      }
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${environment.apiBaseUrl}${environment.endpoints.usuario.getAll}`,
      {
        withCredentials: true,
        params: {
          empresaSelecionada: this.authService.empresaSelected.cdEmpresa,
        },
      }
    );
  }

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${environment.apiBaseUrl}${environment.endpoints.usuario.cadastrar}`,
      usuario,
      {
        withCredentials: true,
        params: {
          empresaSelecionada: this.authService.empresaSelected.cdEmpresa,
        },
      }
    );
  }

  alterarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${environment.apiBaseUrl}${environment.endpoints.usuario.alterar}`,
      usuario,
      {
        withCredentials: true,
        params: {
          empresaSelecionada: this.authService.empresaSelected.cdEmpresa,
        },
      }
    );
  }
}
