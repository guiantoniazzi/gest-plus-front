import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PerfisAcesso } from '../../models/perfisAcesso';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-perfisAcesso',
  imports: [MatTableModule],
  templateUrl: './perfisAcesso.component.html',
  styleUrl: './perfisAcesso.component.scss',
})
export class PerfisAcessoComponent {
  private http = inject(HttpClient);
  
  constructor() {
    this.getPerfisAcesso();
  }
  
  columns = [
    {
      columnDef: 'descricao',
      header: 'Descrição Perfil',
      cell: (e: PerfisAcesso) => `${e.nomePerfil}`,
    },
    {
      columnDef: 'quantidadeFuncoes',
      header: 'Quantidade de Funções',
      cell: (e: PerfisAcesso) => `${e.funcoes.length}`,
    },
    {
      columnDef: 'quantidadeUsuarios',
      header: 'Quantidade de Usuários',
      cell: (e: PerfisAcesso) => `1`,
    },
  ];
  dataSource: PerfisAcesso[] = [];
  displayedColumns = this.columns.map(c => c.columnDef);
  
  getPerfisAcesso() {
    this.http
      .get(`${environment.apiBaseUrl}${environment.endpoints.perfisAcesso.getPerfisComFuncoes}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (value: any) => {
          this.dataSource = value;
        },
        error(err) {
          console.error(err);
        },
      });
  }
}