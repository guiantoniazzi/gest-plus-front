import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../guard/auth.service';
import { Projeto } from '../../models/projeto';
import { SituacaoProj } from '../../models/situacaoProj';

@Injectable({
    providedIn: 'root',
})
export class ProjetoService {
    private http = inject(HttpClient);

    public projetoAlteracao?: Projeto;

    constructor(private authService: AuthService) { }

    getProjetos(): Observable<Projeto[]> {
        return this.http
            .get<Projeto[]>(`${environment.apiBaseUrl}${environment.endpoints.projeto.getAll}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
            });
    }

    cadastrarProjeto(projeto: Projeto): Observable<Projeto> {
        return this.http.post<Projeto>(`${environment.apiBaseUrl}${environment.endpoints.projeto.cadastrar}`, projeto, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
        });
    }
    
    alterarProjeto(projeto: Projeto): Observable<Projeto> {
        return this.http.put<Projeto>(`${environment.apiBaseUrl}${environment.endpoints.projeto.alterar}`, projeto, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
        });
    }

    getSituacaoProj(): Observable<SituacaoProj[]> {
        return this.http
            .get<SituacaoProj[]>(`${environment.apiBaseUrl}${environment.endpoints.situacaoProj.getAll}`, {
                withCredentials: true
            });
    }
}