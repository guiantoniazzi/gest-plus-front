import { Component, inject } from '@angular/core';
import { TipoCampo } from '../../../enum/tipoCampo';
import { FormComponent } from '../../../components/form/form.component';
import { Usuario } from '../../../models/usuario';
import { UsuariosService } from '../usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';
import { Pessoa } from '../../../models/pessoa';
import { PerfisAcessoService } from '../../perfisAcesso/perfisAcesso.service';
import { PerfisAcesso } from '../../../models/perfisAcesso';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usuariosCadastro',
  imports: [
    FormComponent,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './usuariosCadastro.component.html',
  styleUrl: './usuariosCadastro.component.scss',
  host: { class: 'page' }
})
export class UsuariosCadastroComponent {
  private usuariosService = inject(UsuariosService);
  private perfilAcessoService = inject(PerfisAcessoService);
  private snackBar = inject(MatSnackBar);

  private usuario?: Usuario;
  campos: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.usuario = this.usuariosService.usuarioAlteracao;

    this.campos = [
      {
        nome: 'cdUsuario',
        titulo: 'Código do Usuário',
        tipo: TipoCampo.texto,
        valor: this.usuario ? this.usuario.cdUsuario : undefined,
        obrigatorio: true,
        linha: 1,
      },
      {
        nome: 'senha',
        titulo: 'Senha',
        tipo: TipoCampo.texto,
        valor: this.usuario ? this.usuario.senha : undefined,
        invisivel: false,
        linha: 1,
      },
      {
        nome: 'cdPessoa',
        titulo: 'Documento Pessoa',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        listaObservable: this.usuariosService.getPessoas().pipe(
          map((response) =>
            response.map((x: Pessoa) => ({
              label: x.cpfCnpj,
              valor: x.cdPessoa,
            }))
          ),
          catchError((e: any) => {
            console.log(e);
            this.snackBar.open('Erro ao buscar pessoas', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed'],
            });
            return of([]);
          })
        ),
        valor: this.usuario ? this.usuario.cdPessoa : undefined,
      },
      {
        nome: 'idsEmpresas',
        titulo: 'Empresas',
        tipo: TipoCampo.multiselect,
        valor: this.usuario
          ? this.usuario.empresas.map((x) => x.cdPessoa)
          : undefined,
        linha: 1,
        listaObservable: this.usuariosService.getEmpresas().pipe(
          map((response) =>
            response.map((x: Pessoa) => ({
              label: x.pessoaAux.nome,
              valor: x.cdPessoa,
            }))
          )
        ),
      },
      {
        nome: 'perfilAcesso',
        titulo: 'Perfil de Acesso',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 2,
        listaObservable: this.perfilAcessoService.getPerfisAcesso().pipe(
          map((response) =>
            response.map((x: PerfisAcesso) => ({
              label: x.nomePerfil,
              valor: x.cdPerfil,
            }))
          ),
          catchError((e: any) => {
            console.log(e);
            this.snackBar.open('Erro ao buscar perfis', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed'],
            });
            return of([]);
          })
        ),
        valor: this.usuario ? this.usuario.cdPessoa : undefined,
      },
      {
        nome: 'validade',
        titulo: 'Validade',
        tipo: TipoCampo.data,
        valor: this.usuario ? this.usuario.dtValid : undefined,
        linha: 2,
      },
      {
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        valor: this.usuario ? this.usuario.ativo : true,
        linha: 2,
      },
    ];
  }

  envio(value: any): void {
    if (this.usuario) {
      this.usuariosService.alterarUsuario(value).subscribe({
        next: (response) => {
          this.snackBar.open('Usuario alterado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao alterar o usuario!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed'],
          });
        },
      });
    } else {
      this.usuariosService.cadastrarUsuario(value).subscribe({
        next: (response) => {
          this.snackBar.open('Usuario cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar o usuario!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed'],
          });
        },
      });
    }
  }
}
