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
import { GanttBarClickEvent, GanttI18nLocale, GanttItem, GanttSelectedEvent, GanttViewType, NgxGanttModule } from '@worktile/gantt';
import { CommonModule } from "@angular/common";
import { Projeto } from "../../../models/projeto";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-projetoDetalhe',

  imports: [
    FormComponent,
    MatTabsModule,
    NgxGanttModule,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatIconModule, 
    MatSortModule,
    MatButtonModule,
    FormsModule
  ],

  templateUrl: './projetoDetalhe.component.html',

  styleUrl: './projetoDetalhe.component.scss',
  host: { class: 'page' }
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
  // atividades: Atividade[] = [];
  viewType: GanttViewType = GanttViewType.month

  columns = [
    {
      columnDef: 'situacao',
      header: 'Situação',
      cell: (e: Projeto) => `${e.situacaoProj.descSituacao}`,
    },
    {
      columnDef: 'nome',
      header: 'Nome',
      cell: (e: Projeto) => `${e.nomeProj}`,
    },
    {
      columnDef: 'idProjInterno',
      header: 'ID Interno',
      cell: (e: Projeto) => `${e.idProjInterno}`,
    },
    {
      columnDef: 'idProjCliente',
      header: 'ID Cliente',
      cell: (e: Projeto) => `${e.idProjCliente}`,
    },
    {
      columnDef: 'dtInicioPrevista',
      header: 'Início Previsto',
      cell: (e: Projeto) => `${e.dtInicioPrevista}`,
    },
    {
      columnDef: 'dtInicioProj',
      header: 'Início Projeto',
      cell: (e: Projeto) => `${e.dtInicioProj}`,
    },
    {
      columnDef: 'dtFimPrevisto',
      header: 'Fim Previsto',
      cell: (e: Projeto) => `${e.dtFimPrevista}`,
    },
  ];
  dataSource: MatTableDataSource<Projeto> = new MatTableDataSource<Projeto>([]);
  displayedColumns = this.columns.map(c => c.columnDef);


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
        linha: 2,
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
        linha: 2,
        lista: [{ label: 'Alocação', valor: 'A' }, { label: 'Projeto', valor: 'P' }],
        valor: this.projetoService.projetoAlteracao?.tpProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'cdRespProj',
        titulo: 'Responsável',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 2,
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
        linha: 1,
        valor: this.projetoService.projetoAlteracao?.nomeProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'idProjInterno',
        titulo: 'Identificação Interno',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        linha: 1,
        valor: this.projetoService.projetoAlteracao?.idProjInterno,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'idProjCliente',
        titulo: 'Identificação Cliente',
        tipo: TipoCampo.texto,
        maximo: 20,
        linha: 1,
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
        linha: 4,
        valor: this.projetoService.projetoAlteracao?.dtInicioPrevista,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtFimPrevista',
        titulo: 'Fim Prevista',
        tipo: TipoCampo.data,
        linha: 4,
        valor: this.projetoService.projetoAlteracao?.dtFimPrevista,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'qtdHrProj',
        titulo: 'Qtd. Horas',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 5,
        valor: this.projetoService.projetoAlteracao?.qtdHrProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrHrProj',
        titulo: 'Valor Hora',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 5,
        valor: this.projetoService.projetoAlteracao?.vlrHrProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrBaseProj',
        titulo: 'Valor Base',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 5,
        valor: this.projetoService.projetoAlteracao?.vlrBaseProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrDescontoComercial',
        titulo: 'Desconto Comercial',
        tipo: TipoCampo.texto,
        linha: 6,
        valor: this.projetoService.projetoAlteracao?.vlrDescontoComercial,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrAcrescimoProjeto',
        titulo: 'Acréscimo Projeto',
        tipo: TipoCampo.texto,
        linha: 6,
        valor: this.projetoService.projetoAlteracao?.vlrAcrescimoProjeto,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrFinalProjeto',
        titulo: 'Valor Final',
        tipo: TipoCampo.texto,
        linha: 6,
        valor: this.projetoService.projetoAlteracao?.vlrFinalProjeto,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtInicioProj',
        titulo: 'Início Projeto',
        tipo: TipoCampo.data,
        linha: 7,
        valor: this.projetoService.projetoAlteracao?.dtInicioProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'dtFimProj',
        titulo: 'Fim Projeto',
        tipo: TipoCampo.data,
        linha: 7,
        valor: this.projetoService.projetoAlteracao?.dtFimProj,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        nome: 'vlrFaturado',
        titulo: 'Valor Faturado',
        tipo: TipoCampo.texto,
        linha: 7,
        valor: this.projetoService.projetoAlteracao?.vlrFaturado,
        readonly: this.authService.verificaPermissaoParaFuncaoNaEmpresa(Funcionalidade['Gerenciar projeto'])
      },
      {
        // TODO: ENTENDER MELHOR ONDE ENFIAR ESSE CARAIO E PRA FICAR MAIS MELHOR PRO CARA MEXER DIRETO
        nome: 'idSituacaoProj',
        titulo: 'Situação',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
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
    else if (event.index === 2) {
      this.projetoService.getHistoricoProjeto(this.projetoService.projetoAlteracao?.cdProj!).subscribe({
        next: (value: Projeto[]) => {
          this.dataSource.data = value;
        },
        error: (err) => {
          this.snackBar.open('Erro ao buscar histórico do projeto', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      })
    }
  }

  getAtividade() {
        this.projetoService.getAtividadeByProj(this.projetoService.projetoAlteracao?.cdProj!).subscribe({
          next: (value: Atividade[]) => {
            this.projetoService.projetoAlteracao!.atividade = value;
            this.items = value.map(ativ => ({ id: ativ.cdAtiv.toString(), title: ativ.nomeAtiv, start: new Date(ativ.dtInicioPrevista).getTime(), end: new Date(ativ.dtFimPrevista).getTime(), color: ativ.situacaoProj.cor }));
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
        if(this.projetoService.projetoAlteracao) {
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
      this.dialog.open(TarefaDialogComponent).afterClosed().subscribe(() => {
        this.items = this.projetoService.projetoAlteracao!.atividade!.map(ativ => ({ id: ativ.cdAtiv.toString(), title: ativ.nomeAtiv, start: new Date(ativ.dtInicioPrevista).getTime(), end: new Date(ativ.dtFimPrevista).getTime(), color: ativ.situacaoProj.cor }));
        this.projetoService.atividadeAlteracao = undefined;
      });
    }

    getStyle(status: number) {
      return { backgroundColor: 'red' };
    }

    selectedChange(event: GanttSelectedEvent) {
      var ganttItem = (event.selectedValue as GanttItem)
      this.projetoService.atividadeAlteracao = this.projetoService.projetoAlteracao!.atividade!.find(atv => atv.cdAtiv.toString() == ganttItem.id);

      this.dialog.open(TarefaDialogComponent)
    }

    // onBarClick(event: GanttBarClickEvent) {
    // console.log('Barra clicada', event.item);
    // aqui você faz o que quiser: abrir modal, navegar, etc.
    // }
  }