import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cargo } from '../../../models/cargo';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environment';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CargosService } from '../cargos.service';

@Component({
  selector: 'app-cargos',
  imports: [
    MatTableModule, 
    MatIconModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './cargos.component.html',
  styleUrl: './cargos.component.scss',
})
export class CargosComponent implements AfterViewInit {
  private router = inject(Router);
  private cargosService = inject(CargosService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.cargosService.getCargos().subscribe({
      next: (value: Cargo[]) => {
        this.dataSource.data = value;
      },
      error(err) {
        console.error(err);
      }
    });
  }

  ngOnInit() {
    this.dataSource.filterPredicate = (data: Cargo, filter: string) => {
      return data.descCargo.toLowerCase().includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  columns = [
    {
      columnDef: 'cdCargo',
      header: 'Código do cargo',
      cell: (e: Cargo) => `${e.cdCargo}`,
    },
    {
      columnDef: 'descCargo',
      header: 'Descrição do cargo',
      cell: (e: Cargo) => `${e.descCargo}`,
    },
    {
      columnDef: 'ativo',
      header: 'Ativo',
      cell: (e: Cargo) => `${e.ativo}`,
    },
    {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    }
  ];

  dataSource: MatTableDataSource<Cargo> = new MatTableDataSource<Cargo>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(cargo: Cargo): void {
    this.cargosService.cargoAlteracao = cargo;
    this.router.navigate([`/cargos/cadastro`]);
  }

  novo(): void {
    this.cargosService.cargoAlteracao = undefined;
    this.router.navigate([`/cargos/cadastro`]);
  }
}