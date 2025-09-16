import { Component, inject } from '@angular/core';
import { FormComponent } from '../../../../components/form/form.component';
import { Campo } from '../../../../models/campo';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TipoCampo } from '../../../../enum/tipoCampo';
import { ProjetoService } from '../../projeto.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { SituacaoProj } from '../../../../models/situacaoProj';
import { map, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PessoasService } from '../../../pessoas/pessoas.service';
import { Pessoa } from '../../../../models/pessoa';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarefaDialog',

  imports: [
    FormComponent,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './tarefaDialog.component.html',
  styleUrl: './tarefaDialog.component.scss',
})
export class TarefaDialogComponent {
  readonly projetoService = inject(ProjetoService);
  private pessoasService = inject(PessoasService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<TarefaDialogComponent>);
  formGlobal = new FormGroup({});

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
      // valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      obrigatorio: true,
      linha: 1,
    },
    {
      nome: 'dtInicio',
      titulo: 'Data início',
      tipo: TipoCampo.data,
      // valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      obrigatorio: true,
      linha: 2,
      minData: this.projetoService.atividadeAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.atividadeAlteracao?.dtFimPrevista,
    },
    {
      nome: 'dtFim',
      titulo: 'Data fim',
      tipo: TipoCampo.data,
      // valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      linha: 2,
      minData: this.projetoService.atividadeAlteracao?.dtInicioPrevista,
      maxData: this.projetoService.atividadeAlteracao?.dtFimPrevista,
    },
    {
      nome: 'qtdHr',
      titulo: 'Quantidade Horas',
      tipo: TipoCampo.texto,
      // valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      linha: 2,
    },
  ];

  alocacoesProjeto: any;

  ngOnInit(): void {}

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
}
