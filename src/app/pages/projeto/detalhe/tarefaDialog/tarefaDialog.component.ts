import { Component, inject } from "@angular/core";
import { FormComponent } from "../../../../components/form/form.component";
import { Campo } from "../../../../models/campo";
import { MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { TipoCampo } from "../../../../enum/tipoCampo";
import { ProjetoService } from "../../projeto.service";
import { MatTabsModule } from "@angular/material/tabs";
import { SituacaoProj } from "../../../../models/situacaoProj";
import { map, catchError, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PessoasService } from "../../../pessoas/pessoas.service";
import { Pessoa } from "../../../../models/pessoa";

@Component({
  selector: 'app-tarefaDialog',

  imports: [
    FormComponent,
    MatDialogModule,
    MatTabsModule
  ],
  templateUrl: './tarefaDialog.component.html',
  styleUrl: './tarefaDialog.component.scss',
})

export class TarefaDialogComponent {
  private projetoService = inject(ProjetoService);
  private pessoasService = inject(PessoasService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<TarefaDialogComponent>);

  constructor() { }

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
    },
    {
      nome: 'dtFimPrevista',
      titulo: 'Data fim prevista',
      tipo: TipoCampo.data,
      valor: this.projetoService.atividadeAlteracao?.dtFimPrevista,
      obrigatorio: true,
      linha: 2,
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
      nome: 'vlAtv',
      titulo: 'Valor atividade',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.vlrAtiv,
      obrigatorio: true,
      linha: 3,
    },
    {
      nome: 'dtInicio',
      titulo: 'Data início',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.dtInicioAtiv,
      linha: 4,
    },
    {
      nome: 'dtFim',
      titulo: 'Data fim',
      tipo: TipoCampo.texto,
      valor: this.projetoService.atividadeAlteracao?.dtFimAtiv,
      linha: 4,
    },
    {
      nome: 'situacaoAtiv',
      titulo: 'Situação',
      tipo: TipoCampo.select,
      listaObservable: this.projetoService.getSituacaoProj(true).pipe(
        map((response) => response.map((x: SituacaoProj) => ({ label: x.descSituacao, valor: x.cdSituacao }))),
        catchError(() => {
          this.snackBar.open('Erro ao buscar cargos', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
          return of([]);
        })
      ),
      valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      obrigatorio: true,
      linha: 5,
    },
  ]
  camposAlocacoes: Campo[] = [
    {
      nome: 'cdPessoa',
      titulo: 'Funcionário',
      tipo: TipoCampo.select,
      listaObservable: this.pessoasService.getMeusFuncionarios().pipe(
        map((response) => response.map((x: Pessoa) => ({ label: x.pessoaAux.nome, valor: x.cdPessoa }))),
        catchError(() => {
          this.snackBar.open('Erro ao buscar Funcionários', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
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
    },
    {
      nome: 'dtFim',
      titulo: 'Data fim',
      tipo: TipoCampo.data,
      // valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      linha: 2,
    },
    {
      nome: 'qtdHr',
      titulo: 'Quantidade Horas',
      tipo: TipoCampo.data,
      // valor: this.projetoService.atividadeAlteracao?.situacaoAtiv,
      linha: 2,
    }
  ]

  ngOnInit(): void {

  }

  envio(value: any): void {
    console.log(value);
    this.projetoService.cadastrarAtividade(value).subscribe({
      next: (response) => {
        this.snackBar.open('Atividade cadastrada com sucesso', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-success']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Erro ao cadastrar a atividade', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-failed']
        });
      }
    });
    this.dialogRef.close();
    }
}