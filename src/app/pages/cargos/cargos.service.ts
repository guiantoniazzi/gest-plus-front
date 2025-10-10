import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { Cargo } from '../../models/cargo';
import { FuncoesSistema } from '../../models/funcoesSistema';
import { AuthService } from '../../guard/auth.service';

@Injectable({
    providedIn: 'root',
})
export class CargosService {
    private http = inject(HttpClient);

    public cargoAlteracao?: Cargo;

    constructor(private authService: AuthService) { }

    getCargos(): Observable<Cargo[]> {
        return this.http
            .get<Cargo[]>(`${environment.apiBaseUrl}${environment.endpoints.cargo.getAll}`, {
                withCredentials: true,
                params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
            });
    }

    cadastrarCargo(cargo: Cargo): Observable<Cargo> {
        return this.http.post<Cargo>(`${environment.apiBaseUrl}${environment.endpoints.cargo.cadastrar}`, cargo, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
        });
    }
    
    alterarCargo(cargo: Cargo): Observable<Cargo> {
        return this.http.put<Cargo>(`${environment.apiBaseUrl}${environment.endpoints.cargo.alterar}`, cargo, {
            withCredentials: true,
            params: { empresaSelecionada: this.authService.empresaSelected.cdEmpresa}
        });
    }
}