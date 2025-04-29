import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { PerfisAcesso } from '../../models/perfisAcesso';
import { FuncoesSistema } from '../../models/funcoesSistema';

@Injectable({
    providedIn: 'root',
})
export class PerfisAcessoService {
    private http = inject(HttpClient);

    public perfilAlteracao?: PerfisAcesso;

    constructor() { }

    getPerfisAcesso(): Observable<PerfisAcesso[]> {
        return this.http
            .get<PerfisAcesso[]>(`${environment.apiBaseUrl}${environment.endpoints.perfisAcesso.getPerfisComFuncoes}`, {
                withCredentials: true,
            });
    }

    getAllFuncoes(): Observable<FuncoesSistema[]> {
        return this.http.get<FuncoesSistema[]>(`${environment.apiBaseUrl}${environment.endpoints.funcoesSistema.getAllActive}`)
            .pipe(
                tap((funcoes) => {
                    funcoes.sort((a, b) => {
                        const segundaPalavraA = a.nomeFuncao.split(" ")[1] || ""; // Extrai a segunda palavra
                        const segundaPalavraB = b.nomeFuncao.split(" ")[1] || ""; // Extrai a segunda palavra
                        return segundaPalavraA.localeCompare(segundaPalavraB); // Ordena pela segunda palavra
                    });
                }),
                catchError((err): Observable<FuncoesSistema[]> => {
                    console.error(err);
                    return of([]);
                })
            )
    }

    cadastrarPerfilAcesso(perfil: PerfisAcesso): Observable<PerfisAcesso> {
        return this.http.post<PerfisAcesso>(`${environment.apiBaseUrl}${environment.endpoints.perfisAcesso.cadastrar}`, perfil, {
            withCredentials: true,
        });
    }
    
    alterarPerfilAcesso(perfil: PerfisAcesso): Observable<PerfisAcesso> {
        return this.http.put<PerfisAcesso>(`${environment.apiBaseUrl}${environment.endpoints.perfisAcesso.alterar}`, perfil, {
            withCredentials: true,
        });
    }
}