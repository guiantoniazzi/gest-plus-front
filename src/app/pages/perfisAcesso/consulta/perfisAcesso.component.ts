import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PerfisAcesso } from '../../../models/perfisAcesso';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environment';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-perfisAcesso',
  imports: [
    MatTableModule, 
    MatIconModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './perfisAcesso.component.html',
  styleUrl: './perfisAcesso.component.scss',
})
export class PerfisAcessoComponent implements AfterViewInit {
  private http = inject(HttpClient);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.getPerfisAcesso();
  }

  ngOnInit() {
    this.dataSource.filterPredicate = (data: PerfisAcesso, filter: string) => {
      const dataStr = `${data.nomePerfil} ${data.funcoes.length}`;
      return dataStr.toLowerCase().includes(filter);
    };

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'descricao':
          return item.nomePerfil.toLowerCase();
        case 'quantidadeFuncoes':
          return item.funcoes.length;
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
    {
      columnDef: 'ativo',
      header: 'Ativo',
      cell: (e: PerfisAcesso) => `${e.ativo}`,
    },
    {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    }
  ];
  dataSource: MatTableDataSource<PerfisAcesso> = new MatTableDataSource<PerfisAcesso>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPerfisAcesso() {
    this.http
      .get(`${environment.apiBaseUrl}${environment.endpoints.perfisAcesso.getPerfisComFuncoes}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (value: any) => {
          this.dataSource.data = value;
        },
        error(err) {
          console.error(err);
        },
      });
  }

  onEdit(perfil: PerfisAcesso): void {
    console.log(perfil);
  }
}