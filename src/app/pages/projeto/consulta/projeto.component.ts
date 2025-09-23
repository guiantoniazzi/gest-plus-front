import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PerfisAcesso } from '../../../models/perfisAcesso';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ProjetoService } from '../projeto.service';
import { Pessoa } from '../../../models/pessoa';
import { PessoaAux } from '../../../models/pessoaAux';
import { Projeto } from '../../../models/projeto';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-projeto',
  imports: [
    MatTableModule, 
    MatIconModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './projeto.component.html',
  styleUrl: './projeto.component.scss',
  host: { class: 'page' }
})
export class ProjetoComponent implements AfterViewInit {
  private router = inject(Router);
  private projetoService = inject(ProjetoService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.projetoService.getProjetos().subscribe({
      next: (value: Projeto[]) => {
        this.dataSource.data = value;
      },
      error(err) {
        console.error(err);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  columns = [
    {
      columnDef: 'nome',
      header: 'Nome Projeto',
      cell: (e: Projeto) => `${e.nomeProj}`,
    },
    {
      columnDef: 'idInterno',
      header: 'Identificação Interna',
      cell: (e: Projeto) => `${e.idProjInterno}`,
    },
    {
      columnDef: 'idCliente',
      header: 'Identificação Cliente',
      cell: (e: Projeto) => `${e.idProjCliente}`,
    },
    {
      columnDef: 'situacao',
      header: 'Situação',
      cell: (e: Projeto) => `${e.situacaoProj.descSituacao }`,
    },
        {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    }
  ];
  dataSource: MatTableDataSource<Projeto> = new MatTableDataSource<Projeto>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearch(projeto: Projeto): void {
    this.projetoService.projetoAlteracao = projeto;
    this.router.navigate([`/projeto/detalhe`]);
  }

  novo(): void {
    this.projetoService.projetoAlteracao = undefined;
    this.router.navigate([`/projeto/cadastro`]);
  }
}