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
        valor: this.pessoa ? this.pessoa.cdPessoa : undefined,
        invisivel: true,
      },
      {
        nome: 'empresaUsuario',
        titulo: 'Em qual empresa deseja realizar a ação?',
        tipo: TipoCampo.select,
        obrigatorio: true,
        valor: empresas.length == 1 ? empresas[0].valor : this.pessoa ? this.pessoa.nome : undefined,
        linha: 1,
        lista: empresas,
        invisivel: empresas.length == 1 ? true : false,
      },
      {
        nome: 'nome',
        titulo: 'Nome',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        valor: this.pessoa ? this.pessoa.nome : undefined,
        linha: 2,
      },
      {
        nome: 'dtNasc',
        titulo: 'Data Nascimento',
        tipo: TipoCampo.data,
        valor: this.pessoa ? this.pessoa.dtNasc : Date.now(),
        linha: 2,
      },
      {
        nome: 'cpfCnpj',
        titulo: 'CPF/CNPJ',
        obrigatorio: true,
        tipo: TipoCampo.texto,
        valor: this.pessoa ? this.pessoa.cpfCnpj : undefined,
        linha: 2,
        mascara: 'CPFCNPJ',
        validacao: ValidacaoCampo.cpfCnpj,
      },
      {
        nome: 'rg',
        titulo: 'RG',
        tipo: TipoCampo.texto,
        valor: this.pessoa ? this.pessoa.rg : undefined,
        linha: 3,
      },
      {
        nome: 'email',
        titulo: 'Email',
        tipo: TipoCampo.texto,
        valor: this.pessoa ? this.pessoa.email : undefined,
        linha: 3,
        validacao: ValidacaoCampo.email,
      },
      {
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        valor: this.pessoa ? this.pessoa.ativo : true,
        linha: 4,
      },
      {
        nome: 'empresa',
        titulo: 'Empresa',
        tipo: TipoCampo.toggle,
        valor: this.pessoa ? this.pessoa.empresa : undefined,
        linha: 4,
      },
      {
        nome: 'cliente',
        titulo: 'Cliente',
        tipo: TipoCampo.toggle,
        valor: this.pessoa ? this.pessoa.cliente : undefined,
        linha: 4,
      },
      {
        nome: 'funcionario',
        titulo: 'Funcionário Cliente',
        tipo: TipoCampo.toggle,
        valor: this.pessoa ? this.pessoa.cliente : undefined,
        linha: 4,
        condicao: "this.form.get('cliente')?.value"
      },
      {
        nome: 'dtInicio',
        titulo: 'Data Início',
        tipo: TipoCampo.data,
        valor: this.pessoa ? this.pessoa.cdPessoa : undefined,
        invisivel: true,
        linha: 5,
        condicao: "this.form.get('cliente')?.value"
      },
      {
        nome: 'cargo',
        titulo: 'Cargo',
        tipo: TipoCampo.select,
        valor: this.pessoa ? this.pessoa.cdPessoa : undefined,
        invisivel: true,
        linha: 5,
        condicao: "this.form.get('cliente')?.value && this.form.get('funcionario')?.value",
      },
    ];
  }
  
  campos: any[] = [];
  
  envio(value: any): void {
    console.log(value);
  }
}