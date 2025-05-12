import { Component, inject } from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { PerfisAcesso } from "../../../models/perfisAcesso";
import { PerfisAcessoService } from "../perfisAcesso.service";
import { MatSnackBar } from '@angular/material/snack-bar'
import { map } from "rxjs";


@Component({
  selector: 'app-perfisAcessoCadastro',
  imports: [
    FormComponent
  ],
  templateUrl: './perfisAcessoCadastro.component.html',
  styleUrl: './perfisAcessoCadastro.component.scss',
})
export class PerfisAcessoCadastroComponent {
  private perfisAcessoService = inject(PerfisAcessoService);
  private snackBar = inject(MatSnackBar);

  private perfilAcesso?: PerfisAcesso;
  campos: any[] = [];

  constructor(
  ) { }

  ngOnInit(): void {
    this.perfilAcesso = this.perfisAcessoService.perfilAlteracao;

    this.campos = [
      {
        nome: 'idPerfil',
        tipo: TipoCampo.texto,
        valor: this.perfilAcesso ? this.perfilAcesso.cdPerfil : undefined,
        invisivel: true,
      },
      {
        nome: 'nomePerfil',
        titulo: 'Nome Perfil de Acesso',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        valor: this.perfilAcesso ? this.perfilAcesso.nomePerfil : undefined,
        linha: 1,
      },
      {
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        valor: this.perfilAcesso ? this.perfilAcesso.ativo : true,
        linha: 1,
      },
      {
        nome: 'idsFuncoesSistema',
        titulo: 'Funções do Sistema',
        tipo: TipoCampo.multiselect,
        valor: this.perfilAcesso ? this.perfilAcesso.funcoes.map((x) => x.cdFuncao) : undefined,
        linha: 1,
        listaObservable: this.perfisAcessoService.getAllFuncoes().pipe(
          map((response) => response.map((x: any) => ({ label: x.nomeFuncao, valor: x.cdFuncao })))
        ),
      },
    ];
  }

  
  envio(value: any): void {
    if (this.perfilAcesso) {
      this.perfisAcessoService.alterarPerfilAcesso(value).subscribe({
        next: (response) => {
          this.snackBar.open('Perfil de Acesso alterado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao alterar o perfil de acesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
    else {
      this.perfisAcessoService.cadastrarPerfilAcesso(value).subscribe({
        next: (response) => {
          this.snackBar.open('Perfil de Acesso cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar o perfil de acesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
  }
}