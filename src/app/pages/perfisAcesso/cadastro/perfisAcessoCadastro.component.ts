import { Component, inject, Input } from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { PerfisAcesso } from "../../../models/perfisAcesso";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../../environment";
import { FuncoesSistema } from "../../../models/funcoesSistema";
import { catchError, map, Observable, of, tap } from "rxjs";
import { PerfisAcessoService } from "../perfisAcesso.service";


@Component({
  selector: 'app-perfisAcessoCadastro',
  imports: [
    FormComponent
  ],
  templateUrl: './perfisAcessoCadastro.component.html',
  styleUrl: './perfisAcessoCadastro.component.scss',
})
export class PerfisAcessoCadastroComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute)
  private perfisAcessoService = inject(PerfisAcessoService);

  private perfilAcesso?: PerfisAcesso;

  constructor(
  ) {}

  ngOnInit(): void {
    this.perfilAcesso = this.perfisAcessoService.perfilAlteracao;
  }

  campos = [
    {
      nome: 'nmPerfil',
      titulo: 'Nome Perfil de Acesso',
      tipo: TipoCampo.texto,
      obrigatorio: true,
      maximo: 20,
      valor: this.perfilAcesso ? this.perfilAcesso.nomePerfil : undefined,
      linha: 1,
    },
    {
      nome: 'ativo',
      titulo: 'Ativo',
      tipo: TipoCampo.checkbox,
      valor: this.perfilAcesso ? this.perfilAcesso.ativo : true,
      linha: 1,
    },
    {
      nome: 'funcoes',
      titulo: 'Funções do Sistema',
      tipo: TipoCampo.multiselect,
      valor: this.perfilAcesso ? this.perfilAcesso.funcoes : undefined,
      linha: 1,
      lista: this.getAllFuncoes()
    },
  ];

  envio(value: any): void {
    
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
}