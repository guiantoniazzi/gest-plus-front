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
import { PessoasService } from '../pessoas.service';
import { Pessoa } from '../../../models/pessoa';
import { PessoaAux } from '../../../models/pessoaAux';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Funcionalidade } from '../../../enum/funcionalidade';
import { AuthService } from '../../../guard/auth.service';

@Component({
  selector: 'app-pessoas',
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
  templateUrl: './pessoas.component.html',
  styleUrl: './pessoas.component.scss',
  host: { class: 'page' }
})
export class PessoasComponent implements AfterViewInit {
  private router = inject(Router);
  private pessoasService = inject(PessoasService);
  private authService = inject(AuthService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.pessoasService.getPessoas().subscribe({
      next: (value: Pessoa[]) => {
        this.dataSource.data = value;
      },
      error(err) {
        console.error(err);
      }
    });
  }

  ngOnInit() {
    // this.dataSource.filterPredicate = (data: PerfisAcesso, filter: string) => {
    //   const dataStr = `${data.nomePerfil} ${data.funcoes.length}`;
    //   return dataStr.toLowerCase().includes(filter);
    // };

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'descricao':
          return ''//item.nomePerfil.toLowerCase();
        case 'quantidadeFuncoes':
          return ''//item.funcoes.length;
        default:
          return (item as any)[property];
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  columns = [
    {
      columnDef: 'nome',
      header: 'Nome',
      cell: (e: Pessoa) => `${e.pessoaAux.nome}`,
    },
    {
      columnDef: 'tipo',
      header: 'Tipo de Pessoa',
      cell: (e: Pessoa) => `${e.tpPessoa}`,
    },
    {
      columnDef: 'ativo',
      header: 'Ativo',
      cell: (e: Pessoa) => `${e.pessoaAux.ativo}`,
    },
    {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    }
  ];
  dataSource: MatTableDataSource<Pessoa> = new MatTableDataSource<Pessoa>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(pessoa: Pessoa): void {
    this.pessoasService.pessoaAlteracao = pessoa;
    this.router.navigate([`/pessoas/cadastro`]);
  }

  novo(): void {
    this.pessoasService.pessoaAlteracao = undefined;
    this.router.navigate([`/pessoas/cadastro`]);
  }

  verificaPermissaoGerenciar(pessoa?: Pessoa): boolean {
    if(pessoa && pessoa.pessoaAux.cliente) {
      return this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar cliente']); 
    }
    else if(pessoa && pessoa.funcionarioCliente) {
      return this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar funcionário cliente']); 
    }
    else if(pessoa && pessoa.pessoaAux.empresa) {
      return this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar empresa consultoria']); 
    }
    else if(pessoa) {
      return this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar pessoa']); 
    }
    else {
      return (this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar cliente']) ||
      this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar funcionário cliente']) ||
      this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar empresa consultoria']) ||
      this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar pessoa']));
    }
  }
}