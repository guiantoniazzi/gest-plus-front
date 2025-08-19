import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { PerfisAcesso } from '../../models/perfisAcesso';
import { FuncoesSistema } from '../../models/funcoesSistema';
import { Pessoa } from '../../models/pessoa';
import { AuthService } from '../../guard/auth.service';
import { PessoaAux } from '../../models/pessoaAux';

@Injectable({
    providedIn: 'root',
})
export class PessoasService {
    private http = inject(HttpClient);

    public pessoaAlteracao?: Pessoa;

    constructor(private authService: AuthService) { }

    getPessoas(): Observable<Pessoa[]> {
        return this.http
            .get<Pessoa[]>(`${environment.apiBaseUrl}${environment.endpoints.pessoas.getAll}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
            });
    }

    cadastrarPessoa(pessoa: Pessoa): Observable<Pessoa> {
        return this.http.post<Pessoa>(`${environment.apiBaseUrl}${environment.endpoints.pessoas.cadastrar}`, pessoa, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
        });
    }
    
    alterarPessoa(pessoa: Pessoa): Observable<Pessoa> {
        return this.http.put<Pessoa>(`${environment.apiBaseUrl}${environment.endpoints.pessoas.alterar}`, pessoa, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
        });
    }
}