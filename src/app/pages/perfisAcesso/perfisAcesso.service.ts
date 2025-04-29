import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';
import { PerfisAcesso } from '../../models/perfisAcesso';

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
}