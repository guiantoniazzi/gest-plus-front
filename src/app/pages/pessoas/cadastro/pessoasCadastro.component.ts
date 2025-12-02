import { Component, inject } from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { PessoasService } from "../pessoas.service";
import { MatSnackBar } from '@angular/material/snack-bar'
import { Pessoa } from "../../../models/pessoa";
import { AuthService } from "../../../guard/auth.service";
import { Router } from "@angular/router";
import { ValidacaoCampo } from "../../../enum/validacaoCampo";
import { Funcionalidade } from "../../../enum/funcionalidade";
import { map, catchError, of } from "rxjs";
import { Campo } from "../../../models/campo";
import { Cargo } from "../../../models/cargo";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { GanttItem, GanttLink, GanttViewType, NgxGanttModule } from "@worktile/gantt";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { ProjetoService } from "../../projeto/projeto.service";
import { Atividade } from "../../../models/atividade";
import { Projeto } from "../../../models/projeto";


@Component({
  selector: 'app-pessoasCadastro',
  imports: [
    FormComponent,
    MatButtonModule,
    FormsModule,
    NgxGanttModule,
    CommonModule,
    MatTabsModule,
  ],
  templateUrl: './pessoasCadastro.component.html',
  styleUrl: './pessoasCadastro.component.scss',
  host: { class: 'page' }
})
export class PessoasCadastroComponent {
  public pessoasService = inject(PessoasService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private projetoService = inject(ProjetoService);
  
  private pessoa?: Pessoa;
  private funcionarioCliente?: Pessoa;
  
  constructor() { }

  campos: Campo[] = [];

  items: GanttItem[] = [];

  viewType: GanttViewType = GanttViewType.month

  ngOnInit(): void {
    this.campos = [
      {
        nome: 'cdPessoa',
        tipo: TipoCampo.texto,
        valor: this.pessoasService.pessoaAlteracao?.cdPessoa,
        invisivel: true,
      },
      {
        nome: 'cdEmpresa',
        titulo: 'Empresa cadastrar',
        tipo: TipoCampo.select,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux?.cdEmpresa,
        invisivel: this.authService.getLogin().cdUsuario !== "ADMIN",
        linha: 1,
        listaObservable: this.pessoasService.getEmpresasAdm().pipe(
          map((response) => response.map((x: any) => ({ label: x.pessoaAux.nome, valor: x.cdPessoa }))),
          catchError(() => {
            this.snackBar.open('Erro ao buscar empresas', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed']
            });
            return of([]);
          })
        ),
      },
      {
        nome: 'nome',
        titulo: 'Nome',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.nome,
        linha: 2,
      },
      {
        nome: 'dtNasc',
        titulo: 'Data Nascimento',
        tipo: TipoCampo.data,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.dtNasc?.toString() !== '0000-00-00' ? this.pessoasService.pessoaAlteracao?.pessoaAux.dtNasc : undefined,
        linha: 2,
      },
      {
        nome: 'cpfCnpj',
        titulo: 'CPF/CNPJ',
        obrigatorio: true,
        tipo: TipoCampo.texto,
        valor: this.pessoasService.pessoaAlteracao?.cpfCnpj,
        linha: 2,
        mascara: 'CPFCNPJ',
        validacao: ValidacaoCampo.cpfCnpj,
        readonly: this.pessoasService.pessoaAlteracao ? true : false,
      },
      {
        nome: 'rg',
        titulo: 'RG',
        tipo: TipoCampo.texto,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.rg,
        linha: 3,
      },
      {
        nome: 'email',
        titulo: 'Email',
        tipo: TipoCampo.texto,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.email,
        linha: 3,
        validacao: ValidacaoCampo.email,
      },
      {
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        valor: this.pessoasService.pessoaAlteracao ? this.pessoasService.pessoaAlteracao.pessoaAux.ativo : true,
        linha: 4,
      },
      {
        nome: 'empresa',
        titulo: 'Empresa',
        tipo: TipoCampo.toggle,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.empresa,
        linha: 4,
        condicao: `this.authService.verificaPermissaoParaFuncaoNaEmpresa(${Funcionalidade['Gerenciar empresa consultoria']})`,
        change: 'changeToggleExclusive($event, campo)',
      },
      {
        nome: 'meuFunc',
        titulo: `Funcionário ${this.authService.empresaSelected.nomeEmpresa}`,
        tipo: TipoCampo.toggle,
        valor: !this.pessoasService.pessoaAlteracao?.pessoaAux.cliente && !this.pessoasService.pessoaAlteracao?.pessoaAux.cliente,
        linha: 4,
        change: 'changeToggleExclusive($event, campo)',
      },
      {
        nome: 'cliente',
        titulo: 'Cliente',
        tipo: TipoCampo.toggle,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.cliente,
        linha: 4,
        condicao: `this.authService.verificaPermissaoParaFuncaoNaEmpresa(${Funcionalidade['Gerenciar cliente']})`,
        change: 'changeToggleExclusive($event, campo)',
      },
      {
        nome: 'funcionario',
        titulo: 'Funcionário Cliente',
        tipo: TipoCampo.toggle,
        valor: this.pessoasService.pessoaAlteracao?.funcionarioCliente?.ativo,
        linha: 4,
        condicao: `this.authService.verificaPermissaoParaFuncaoNaEmpresa(${Funcionalidade["Gerenciar funcionário cliente"]})`,
        change: 'changeToggleExclusive($event, campo)',
      },
      {
        nome: 'dtInicio',
        titulo: 'Data Início',
        tipo: TipoCampo.data,
        obrigatorioDisplayed: true,
        valor: this.pessoasService.pessoaAlteracao?.funcionarioCliente?.dtInicio?.toString() !== '0000-00-00' ? this.pessoasService.pessoaAlteracao?.funcionarioCliente?.dtInicio : undefined,
        // invisivel: true,
        linha: 5,
        condicao: "this.form.get('cliente')?.value || this.form.get('funcionario')?.value",
      },
      {
        nome: 'cdCliente',
        titulo: 'Cliente',
        tipo: TipoCampo.select,
        listaObservable: this.pessoasService.getClientes().pipe(
          map((response) => response.map((x: any) => ({ label: x.pessoaAux.nome, valor: x.cdPessoa }))),
          catchError(() => {
            this.snackBar.open('Erro ao buscar clientes', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed']
            });
            return of([]);
          })
        ),
        valor: this.pessoasService.pessoaAlteracao?.funcionarioCliente?.cdCliente,
        obrigatorioDisplayed: true,
        // invisivel: true,
        linha: 5,
        condicao: "this.form.get('funcionario')?.value",
      },
      {
        nome: 'cargo',
        titulo: 'Cargo',
        tipo: TipoCampo.select,
        listaObservable: this.pessoasService.getCargos().pipe(
          map((response) => response.map((x: Cargo) => ({ label: x.descCargo, valor: x.cdCargo }))),
          catchError(() => {
            this.snackBar.open('Erro ao buscar cargos', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed']
            });
            return of([]);
          })
        ),
        valor: this.pessoasService.pessoaAlteracao?.funcionarioCliente?.cargoFuncionario,
        obrigatorioDisplayed: true,
        // invisivel: true,
        linha: 5,
        condicao: "this.form.get('funcionario')?.value",
      },
    ];
  }
  
  envio(value: any): void {
    if(this.pessoasService.pessoaAlteracao){
      value.cpfCnpj = value.cpfCnpj.replace('.', '').replace('/', '').replace('-', '');
      this.pessoasService.alterarPessoa(value).subscribe({
        next: (value: any) => {
          this.snackBar.open('Pessoa alterada com sucesso', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
          this.pessoasService.pessoaAlteracao = undefined;
          this.router.navigate(['/pessoas']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao alterar a pessoa', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
    else {
      this.pessoasService.cadastrarPessoa(value).subscribe({
        next: (value: any) => {
          this.snackBar.open('Pessoa cadastrada com sucesso', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
          this.pessoasService.pessoaAlteracao = undefined;
          this.router.navigate(['/pessoas']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar a pessoa', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
  }

  tabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.projetoService.getProjetoByCdPessoa(this.pessoasService.pessoaAlteracao?.cdPessoa!).subscribe({
        next: (value: Projeto[]) => {
            this.items = value.map(proj => ({ 
              id: proj.cdProj.toString(), 
              title: proj.nomeProj, 
              start: Math.min(...proj.atividade!.map(ativ => new Date(ativ.dtInicioPrevista).getTime())), 
              end: Math.max(...proj.atividade!.map(ativ => new Date(ativ.dtFimPrevista).getTime())), 
              expandable: true, 
              children: proj.atividade?.map(ativ => ({ 
                id: ativ.cdAtiv.toString(), 
                title: ativ.nomeAtiv, 
                start: new Date(ativ.dtInicioPrevista).getTime(), 
                end: new Date(ativ.dtFimPrevista!).getTime(),
                color: ativ.situacaoProj.cor
              }))
            }));
            console.log(this.items);
        },
        error: (err) => {
          this.snackBar.open('Erro ao buscar atividades da pessoa', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });

    }
  }
}