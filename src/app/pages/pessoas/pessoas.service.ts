import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';
import { Pessoa } from '../../models/pessoa';
import { AuthService } from '../../guard/auth.service';
import { Cargo } from '../../models/cargo';

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

    getClientes(): Observable<Pessoa[]> {
        return this.http
            .get<Pessoa[]>(`${environment.apiBaseUrl}${environment.endpoints.pessoas.getClientes}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
            });
    }

    getFuncionarios(idCliente: number): Observable<Pessoa[]> {
        return this.http
            .get<Pessoa[]>(`${environment.apiBaseUrl}${environment.endpoints.pessoas.getFuncionarios}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa, idCliente: idCliente }
            });
    }

    getMeusFuncionarios(): Observable<Pessoa[]> {
        return this.http
            .get<Pessoa[]>(`${environment.apiBaseUrl}${environment.endpoints.pessoas.getMeusFuncionarios}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
            });
    }

    getCargos(): Observable<Cargo[]> {
        return this.http
            .get<Cargo[]>(`${environment.apiBaseUrl}${environment.endpoints.cargo.getAll}`, {
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