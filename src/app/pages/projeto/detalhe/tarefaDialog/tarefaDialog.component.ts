import { Component, inject, ViewChild } from '@angular/core';
import { FormComponent } from '../../../../components/form/form.component';
import { Campo, ListaSelect } from '../../../../models/campo';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TipoCampo } from '../../../../enum/tipoCampo';
import { ProjetoService } from '../../projeto.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { SituacaoProj } from '../../../../models/situacaoProj';
import { map, catchError, of, filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PessoasService } from '../../../pessoas/pessoas.service';
import { Pessoa } from '../../../../models/pessoa';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PessoaAtividade } from '../../../../models/pessoaAtividade';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Atividade } from '../../../../models/atividade';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tarefaDialog',

  imports: [
    FormComponent,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatIconModule, 
    MatSortModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './tarefaDialog.component.html',
  styleUrl: './tarefaDialog.component.scss',
})
export class TarefaDialogComponent {
  readonly projetoService = inject(ProjetoService);
  private pessoasService = inject(PessoasService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<TarefaDialogComponent>);
  
  form: FormGroup = new FormGroup({});

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formComponent') formComponent!: FormComponent;

  constructor() {}

  campos: Campo[] = [
    {
      nome: 'cdProj',
      tipo: TipoCampo.texto,
      valor: this.projetoService.projetoAlteracao?.cdProj,
      invisivel: true,
    },
    {
      nome: 'nomeAtiv',
      titulo: 'Nome atividade',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.nomeAtiv,
      obrigatorio: true,
      linha: 1,
    },
    {
      nome: 'dtInicioPrevista',
      titulo: 'Data início prevista',
      tipo: TipoCampo.data,
      valor: this.projetoService.atividadeAlteracao?.dtInicioPrevista,
      obrigatorio: true,
      linha: 2,
      minData: this.projetoService.projetoAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.projetoAlteracao?.dtFimPrevista,
    },
    {
      nome: 'dtFimPrevista',
      titulo: 'Data fim prevista',
      tipo: TipoCampo.data,
      valor: this.projetoService.atividadeAlteracao?.dtFimPrevista,
      obrigatorio: true,
      linha: 2,
      minData: this.projetoService.projetoAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.projetoAlteracao?.dtFimPrevista,
    },
    {
      nome: 'qtdHrPrevista',
      titulo: 'Qtd horas previstas',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.qtdHrPrevista,
      obrigatorio: true,
      linha: 2,
    },
    {
      nome: 'qtdHr',
      titulo: 'Quantidade horas',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.qtdHr,
      linha: 3,
    },
    {
      nome: 'vlrAtiv',
      titulo: 'Valor atividade',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.vlrAtiv,
      obrigatorio: true,
      linha: 3,
    },
    {
      nome: 'dtInicioAtiv',
      titulo: 'Data início',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.dtInicioAtiv,
      linha: 4,
      minData: this.projetoService.projetoAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.projetoAlteracao?.dtFimPrevista,
    },
    {
      nome: 'dtFimAtiv',
      titulo: 'Data fim',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.dtFimAtiv,
      linha: 4,
      minData: this.projetoService.projetoAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.projetoAlteracao?.dtFimPrevista,
    },
    {
      nome: 'situacaoAtiv',
      titulo: 'Situação',
      tipo: TipoCampo.select,
      listaObservable: this.projetoService.getSituacaoProj(true).pipe(
        map((response) =>
          response.map((x: SituacaoProj) => ({
            label: x.descSituacao,
            valor: x.cdSituacao,
          }))
        ),
        catchError(() => {
          this.snackBar.open('Erro ao buscar cargos', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed'],
          });
          return of([]);
        })
      ),
      valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      obrigatorio: true,
      linha: 5,
    },
  ];
  camposAlocacoes: Campo[] = [
    {
      nome: 'cdPessoa',
      titulo: 'Funcionário',
      tipo: TipoCampo.select,
      listaObservable: this.pessoasService.getMeusFuncionarios().pipe(
        map((response) =>
          response.map((x: Pessoa) => ({
            label: x.pessoaAux.nome,
            valor: x.cdPessoa,
          }))
        ),
        catchError(() => {
          this.snackBar.open('Erro ao buscar Funcionários', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed'],
          });
          return of([]);
        })
      ),
      obrigatorio: true,
      linha: 1,
    },
    {
      nome: 'dtInicio',
      titulo: 'Data início',
      tipo: TipoCampo.data,
      obrigatorio: true,
      linha: 2,
      minData: this.projetoService.atividadeAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.atividadeAlteracao?.dtFimPrevista,
    },
    {
      nome: 'dtFim',
      titulo: 'Data fim',
      tipo: TipoCampo.data,
      linha: 2,
      minData: this.projetoService.atividadeAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.atividadeAlteracao?.dtFimPrevista,
    },
    {
      nome: 'qtdHr',
      titulo: 'Quantidade Horas',
      tipo: TipoCampo.texto,
      linha: 2,
    },
  ];

  columns = [
    {
      columnDef: 'nome',
      header: 'Nome',
      cell: (e: PessoaAtividade) => `${e.pessoaAux.nome}`,
    },
    {
      columnDef: 'dtInicio',
      header: 'Data Início',
      cell: (e: PessoaAtividade) => `${e.dtInicio}`,
    },
    {
      columnDef: 'dtFim',
      header: 'Data Fim',
      cell: (e: PessoaAtividade) => `${e.dtFim}`,
    },
    {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    }
  ];
  dataSource: MatTableDataSource<PessoaAtividade> = new MatTableDataSource<PessoaAtividade>(
    this.projetoService.atividadeAlteracao?.pessoasAtividade
  );
  displayedColumns = this.columns.map(c => c.columnDef);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  envio(value: any): void {
    if (value.cdPessoa) {
      value.cdAtiv = this.projetoService.atividadeAlteracao?.cdAtiv;
      value.cdProj = this.projetoService.atividadeAlteracao?.cdProj;
      this.projetoService.alocarFuncionario(value).subscribe({
        next: (response: any) => {
          this.snackBar.open('Funcionário alocado com sucesso', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
          });

          this.formComponent.patchForm({
            cdPessoa: null,
            dtInicio: null,
            dtFim: null,
            qtdHr: null,
          });

          this.projetoService.getAtividadeByProj(this.projetoService.atividadeAlteracao?.cdProj!).subscribe({
            next: (atividades: any) => {
              this.projetoService.projetoAlteracao!.atividade = atividades;
              this.projetoService.atividadeAlteracao = atividades.find((a: Atividade) => a.cdAtiv == this.projetoService.atividadeAlteracao?.cdAtiv);
              this.dataSource.data = this.projetoService.atividadeAlteracao!.pessoasAtividade;
            },
            error: (err: any) => {
              this.snackBar.open('Erro ao buscar atividades', 'Fechar', {
                duration: 3000,
                panelClass: ['snack-bar-failed'],
              });
            }
          });
        },
        error: (err: any) => {
          this.snackBar.open('Erro ao alocar funcionário', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed'],
          });
        },
      });
    } else {
      this.projetoService.cadastrarAtividade(value).subscribe({
        next: (response: any) => {
          this.snackBar.open('Atividade cadastrada com sucesso', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
          });
          this.projetoService.atividadeAlteracao = response;
          this.camposAlocacoes.forEach((campo) => {
            if (['dtInicio', 'dtFim'].includes(campo.nome)) {
              campo.minData =
                this.projetoService.atividadeAlteracao?.dtInicioPrevista;
              campo.maxData =
                this.projetoService.atividadeAlteracao?.dtFimPrevista;
            }
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar a atividade', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed'],
          });
        },
      });
    }
  }

  onTabChange(e: MatTabChangeEvent) {
    if (e.index == 2) {
    }
  }
  
  onEdit(row: PessoaAtividade) {
    this.formComponent.patchForm({
      cdPessoa: row.cdPessoa,
      dtInicio: row.dtInicio,
      dtFim: row.dtFim,
      qtdHr: row.qtdHr,
    })
  }
}
