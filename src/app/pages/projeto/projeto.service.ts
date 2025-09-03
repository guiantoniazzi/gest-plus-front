import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../guard/auth.service';
import { Projeto } from '../../models/projeto';
import { SituacaoProj } from '../../models/situacaoProj';
import { Atividade } from '../../models/atividade';
import { Alocacao } from '../../models/alocacao';

@Injectable({
    providedIn: 'root',
})
export class ProjetoService {
    private http = inject(HttpClient);

    public projetoAlteracao?: Projeto;
    public atividadeAlteracao?: Atividade;

    constructor(private authService: AuthService) { }

    getProjetos(): Observable<Projeto[]> {
        return this.http
            .get<Projeto[]>(`${environment.apiBaseUrl}${environment.endpoints.projeto.getAll}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
            });
    }

    cadastrarAtividade(atividade: Atividade): Observable<Atividade> {
        return this.http.post<Atividade>(`${environment.apiBaseUrl}${environment.endpoints.atividade.cadastrar}`, atividade, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
        });
    }

    cadastrarProjeto(projeto: Projeto): Observable<Projeto> {
        return this.http.post<Projeto>(`${environment.apiBaseUrl}${environment.endpoints.projeto.cadastrar}`, projeto, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
        });
    }

    alterarProjeto(projeto: Projeto): Observable<Projeto> {
        return this.http.put<Projeto>(`${environment.apiBaseUrl}${environment.endpoints.projeto.alterar}`, projeto, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
        });
    }

    getSituacaoProj(atividade: boolean = false): Observable<SituacaoProj[]> {
        return this.http
            .get<SituacaoProj[]>(`${environment.apiBaseUrl}${environment.endpoints.situacaoProj.getAll}`, {
                withCredentials: true,
                params: { atividade: atividade }
            });
    }

    getAtividadeByProj(idProj: number): Observable<Atividade[]> {
        return this.http
            .get<Atividade[]>(`${environment.apiBaseUrl}${environment.endpoints.atividade.getByProj}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa, idProj: idProj.toString() }
            });
    }

    alocarFuncionario(alocacao: Alocacao): Observable<Alocacao> {
        return this.http.post<Alocacao>(`${environment.apiBaseUrl}${environment.endpoints.atividade.alocar}`, alocacao, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa }
        });
    }
}