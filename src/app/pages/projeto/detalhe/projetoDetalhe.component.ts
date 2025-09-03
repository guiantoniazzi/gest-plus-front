import {
  Component,
  inject
} from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { ProjetoService } from '../projeto.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { PessoasService } from "../../pessoas/pessoas.service";
import { catchError, map, of } from "rxjs";
import { Pessoa } from "../../../models/pessoa";
import { Campo } from "../../../models/campo";
import { SituacaoProj } from "../../../models/situacaoProj";
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { AuthService } from "../../../guard/auth.service";
import { Funcionalidade } from "../../../enum/funcionalidade";
import { Atividade } from "../../../models/atividade";
import { TarefaDialogComponent } from "./tarefaDialog/tarefaDialog.component";
import { GanttI18nLocale, GanttItem, GanttViewType, NgxGanttModule } from '@worktile/gantt';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-projetoDetalhe',

  imports: [
    FormComponent,
    MatTabsModule,
    NgxGanttModule,
    CommonModule
  ],

  templateUrl: './projetoDetalhe.component.html',

  styleUrl: './projetoDetalhe.component.scss',

})
export class ProjetoDetalheComponent {
  private projetoService = inject(ProjetoService);
  private pessoasService = inject(PessoasService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);

  constructor(
  ) { }

  campos: Campo[] = [];

  items: GanttItem[] = [];
  viewType: GanttViewType = GanttViewType.month



  ngOnInit(): void {
    this.campos = [
      {
        nome: 'cdProj',
        tipo: TipoCampo.texto,
        valor: this.projetoService.projetoAlteracao?.cdProj,
        invisivel: true
      },
      {
        nome: 'cdCliente',
        titulo: 'Cliente',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        listaObservable: this.pessoasService.getClientes().pipe(
          map((response) => response.map((x: Pessoa) => ({ label: x.pessoaAux.nome, valor: x.cdPessoa }))),
          catchError(() => {
            this.snackBar.open('Erro ao buscar clientes', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed']
            });
            return of([]);
          })
        ),
        valor: this.projetoService.projetoAlteracao?.cdCliente,
        change: 'changeCliente($event)',
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'tpProj',
        titulo: 'Tipo Projeto',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        lista: [{ label: 'Alocação', valor: 'A' }, { label: 'Projeto', valor: 'P' }],
        valor: this.projetoService.projetoAlteracao?.tpProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'cdRespProj',
        titulo: 'Responsável',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        listaObservable: this.pessoasService.getFuncionarios(this.projetoService.projetoAlteracao?.cdCliente!).pipe(
          map((response) => response.map((x: Pessoa) => ({ label: x.pessoaAux.nome, valor: x.cdPessoa }))),
          catchError(() => {
            this.snackBar.open('Erro ao buscar clientes', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed']
            });
            return of([]);
          })
        ),
        valor: this.projetoService.projetoAlteracao?.cdRespProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'nomeProj',
        titulo: 'Nome Projeto',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 40,
        linha: 2,
        valor: this.projetoService.projetoAlteracao?.nomeProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'idProjInterno',
        titulo: 'Identificação Interno',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        linha: 2,
        valor: this.projetoService.projetoAlteracao?.idProjInterno,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'idProjCliente',
        titulo: 'Identificação Cliente',
        tipo: TipoCampo.texto,
        maximo: 20,
        linha: 2,
        valor: this.projetoService.projetoAlteracao?.idProjCliente,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtInicioAvaliacao',
        titulo: 'Início Avaliação',
        tipo: TipoCampo.data,
        obrigatorio: true,
        linha: 3,
        valor: this.projetoService.projetoAlteracao?.dtInicioAvaliacao,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtInicioNegociacao',
        titulo: 'Início Negociação',
        tipo: TipoCampo.data,
        linha: 3,
        valor: this.projetoService.projetoAlteracao?.dtInicioNegociacao,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtInicioPrevista',
        titulo: 'Início Prevista',
        tipo: TipoCampo.data,
        obrigatorio: true,
        linha: 3,
        valor: this.projetoService.projetoAlteracao?.dtInicioPrevista,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtFimPrevista',
        titulo: 'Fim Prevista',
        tipo: TipoCampo.data,
        linha: 3,
        valor: this.projetoService.projetoAlteracao?.dtFimPrevista,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'qtdHrProj',
        titulo: 'Qtd. Horas',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 4,
        valor: this.projetoService.projetoAlteracao?.qtdHrProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrHrProj',
        titulo: 'Valor Hora',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 4,
        valor: this.projetoService.projetoAlteracao?.vlrHrProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrBaseProj',
        titulo: 'Valor Base',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 4,
        valor: this.projetoService.projetoAlteracao?.vlrBaseProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrDescontoComercial',
        titulo: 'Desconto Comercial',
        tipo: TipoCampo.texto,
        linha: 5,
        valor: this.projetoService.projetoAlteracao?.vlrDescontoComercial,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrAcrescimoProjeto',
        titulo: 'Acréscimo Projeto',
        tipo: TipoCampo.texto,
        linha: 5,
        valor: this.projetoService.projetoAlteracao?.vlrAcrescimoProjeto,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrFinalProjeto',
        titulo: 'Valor Final',
        tipo: TipoCampo.texto,
        linha: 5,
        valor: this.projetoService.projetoAlteracao?.vlrFinalProjeto,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtInicioProj',
        titulo: 'Início Projeto',
        tipo: TipoCampo.data,
        linha: 6,
        valor: this.projetoService.projetoAlteracao?.dtInicioProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtFimProj',
        titulo: 'Fim Projeto',
        tipo: TipoCampo.data,
        linha: 6,
        valor: this.projetoService.projetoAlteracao?.dtFimProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrFaturado',
        titulo: 'Valor Faturado',
        tipo: TipoCampo.texto,
        linha: 6,
        valor: this.projetoService.projetoAlteracao?.vlrFaturado,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        // TODO: ENTENDER MELHOR ONDE ENFIAR ESSE CARAIO E PRA FICAR MAIS MELHOR PRO CARA MEXER DIRETO
        nome: 'idSituacaoProj',
        titulo: 'Situação',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 7,
        listaObservable: this.projetoService.getSituacaoProj().pipe(
          map((response) => response.map((x: SituacaoProj) => ({ label: x.descSituacao, valor: x.cdSituacao }))),
          catchError(() => {
            this.snackBar.open('Erro ao buscar situações de projeto', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed']
            });
            return of([]);
          })
        ),
        valor: this.projetoService.projetoAlteracao?.idSituacaoProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
    ];


  }

  tabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.getAtividade();
    }
  }

  getAtividade() {
    this.projetoService.getAtividadeByProj(this.projetoService.projetoAlteracao?.cdProj!).subscribe({
      next: (value: Atividade[]) => {
        this.items = value.map(ativ => ({ id: ativ.cdAtiv.toString(), title: ativ.nomeAtiv, start: new Date(ativ.dtInicioPrevista).getTime(), end: new Date(ativ.dtFimPrevista).getTime() }));
      },
      error: (err) => {
        this.snackBar.open('Erro ao buscar atividades do projeto', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-failed']
        });
      }
    });
  }

  envio(value: any): void {
    if (this.projetoService.projetoAlteracao) {
      this.projetoService.alterarProjeto(value).subscribe({
        next: (value: any) => {
          this.snackBar.open('Projeto alterado com sucesso!',
            'Fechar',
            {
              duration: 3000,

              panelClass: ['snack-bar-success']
            });
          this.projetoService.projetoAlteracao = undefined;
          this.router.navigate(['/projeto']);
        },

        error: (err) => {
          this.snackBar.open('Erro ao alterar o projeto!',
            'Fechar',
            {
              duration: 3000,

              panelClass: ['snack-bar-failed']
            });
        }
      });
    }
    else {
      this.projetoService.cadastrarProjeto(value).subscribe({
        next: (value: any) => {
          this.snackBar.open('Projeto cadastrado com sucesso!',
            'Fechar',
            {
              duration: 3000,

              panelClass: ['snack-bar-success']
            });
          this.projetoService.projetoAlteracao = undefined;
        },

        error: (err) => {
          this.snackBar.open('Erro ao cadastrar o projeto!',
            'Fechar',
            {
              duration: 3000,

              panelClass: ['snack-bar-failed']
            });
        }
      });
    }
  }

  abrirModalTarefa() {
    this.dialog.open(TarefaDialogComponent)
  }
}