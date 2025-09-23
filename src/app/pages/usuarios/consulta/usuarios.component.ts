import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environment';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UsuariosService } from '../usuarios.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  host: { class: 'page' }
})
export class UsuariosComponent implements AfterViewInit {
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.usuariosService.getUsuarios().subscribe({
      next: (value: Usuario[]) => {
        console.log(value);
        this.dataSource.data = value;
      },
      error(err) {
        console.error(err);
      }
    });
  }

  ngOnInit() {
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      return data.cdUsuario.toLowerCase().includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  columns = [
    {
      columnDef: 'cdUsuario',
      header: 'Código do usuario',
      cell: (e: Usuario) => `${e.cdUsuario}`,
    },
    {
      columnDef: 'qtdEmpresas',
      header: 'Quantidade de empresas',
      cell: (e: Usuario) => `${e.empresas.length}`,
    },
    {
      columnDef: 'ativo',
      header: 'Ativo',
      cell: (e: Usuario) => `${e.ativo}`,
    },
    {
      columnDef: 'validade',
      header: 'Validade',
      cell: (e: Usuario) => `${e.dtValid || ''}`,
    },
    {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    }
  ];

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(usuario: Usuario): void {
    this.usuariosService.usuarioAlteracao = usuario;
    this.router.navigate([`/usuarios/cadastro`]);
  }

  novo(): void {
    this.usuariosService.usuarioAlteracao = undefined;
    this.router.navigate([`/usuarios/cadastro`]);
  }
}