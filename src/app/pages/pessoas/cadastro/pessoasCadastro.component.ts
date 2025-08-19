import { Component, inject } from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { PerfisAcesso } from "../../../models/perfisAcesso";
import { PessoasService } from "../pessoas.service";
import { MatSnackBar } from '@angular/material/snack-bar'
import { Pessoa } from "../../../models/pessoa";
import { AuthService } from "../../../guard/auth.service";
import { Router } from "@angular/router";
import { ValidacaoCampo } from "../../../enum/validacaoCampo";
import { Funcionalidade } from "../../../enum/funcionalidade";


@Component({
  selector: 'app-pessoasCadastro',
  imports: [
    FormComponent
  ],
  templateUrl: './pessoasCadastro.component.html',
  styleUrl: './pessoasCadastro.component.scss',
})
export class PessoasCadastroComponent {
  private pessoasService = inject(PessoasService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  private pessoa?: Pessoa;
  private funcionarioCliente?: Pessoa;

  constructor() { }

  ngOnInit(): void {
    var empresas = this.authService.getLogin().empresa
      .filter(emp => emp.cdFuncao.some(func => this.authService.verificaPermissaoPara('/pessoas/cadastro', func)))
      .map((x: any) => ({ label: x.nomeEmpresa, valor: x.cdEmpresa }));

    this.campos = [
      {
        nome: 'cdPessoa',
        tipo: TipoCampo.texto,
        valor: this.pessoasService.pessoaAlteracao?.cdPessoa,
        invisivel: true,
      },
      // {
      //   nome: 'empresaUsuario',
      //   titulo: 'Em qual empresa deseja realizar a ação?',
      //   tipo: TipoCampo.select,
      //   obrigatorio: true,
      //   valor: empresas.length == 1 ? empresas[0].valor : this.pessoa ? this.pessoa.nome : undefined,
      //   linha: 1,
      //   lista: empresas,
      //   invisivel: empresas.length == 1 ? true : false,
      //   change: "changeEmpresaUsuario($event)"
      // },
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
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.dtNasc,
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
        condicao: `this.authService.verificaPermissaoParaFuncaoNaEmpresa(${Funcionalidade['Gerenciar empresa consultoria']})`
      },
      {
        nome: 'cliente',
        titulo: 'Cliente',
        tipo: TipoCampo.toggle,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.cliente,
        linha: 4,
        condicao: `this.authService.verificaPermissaoParaFuncaoNaEmpresa(${Funcionalidade['Gerenciar cliente']})`
      },
      {
        nome: 'funcionario',
        titulo: 'Funcionário Cliente',
        tipo: TipoCampo.toggle,
        valor: this.pessoasService.pessoaAlteracao?.pessoaAux.cliente,
        linha: 4,
        condicao: `this.authService.verificaPermissaoParaFuncaoNaEmpresa(${Funcionalidade["Gerenciar funcionário cliente"]})`,
      },
      {
        nome: 'dtInicio',
        titulo: 'Data Início',
        tipo: TipoCampo.data,
        valor: this.pessoasService.pessoaAlteracao?.cdPessoa,
        // invisivel: true,
        linha: 5,
        condicao: "this.form.get('cliente')?.value || this.form.get('funcionario')?.value",
      },
      {
        nome: 'cargo',
        titulo: 'Cargo',
        tipo: TipoCampo.select,
        valor: this.pessoasService.pessoaAlteracao?.cdPessoa,
        // invisivel: true,
        linha: 5,
        condicao: "this.form.get('funcionario')?.value",
      },
    ];
  }
  
  campos: any[] = [];
  
  envio(value: any): void {
    if(this.pessoasService.pessoaAlteracao){
      this.pessoasService.alterarPessoa(value).subscribe({
        next: (value: any) => {
          this.snackBar.open('Pessoa alterada com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
          this.pessoasService.pessoaAlteracao = undefined;
          this.router.navigate(['/pessoas']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao alterar a pessoa!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
    else {
      this.pessoasService.cadastrarPessoa(value).subscribe({
        next: (value: any) => {
          this.snackBar.open('Pessoa cadastrada com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
          this.pessoasService.pessoaAlteracao = undefined;
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar a pessoa!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
  }
}