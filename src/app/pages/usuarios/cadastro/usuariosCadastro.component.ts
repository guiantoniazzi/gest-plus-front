import { Component, inject, ViewChild } from '@angular/core';
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
import { Campo } from '../../../models/campo';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Associacao } from '../../../models/associacao';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuariosCadastro',
  imports: [
    FormComponent,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './usuariosCadastro.component.html',
  styleUrl: './usuariosCadastro.component.scss',
  host: { class: 'page' }
})
export class UsuariosCadastroComponent {
  public usuariosService = inject(UsuariosService);
  private perfilAcessoService = inject(PerfisAcessoService);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formComponent') formComponent!: FormComponent;

  public usuario?: Usuario;
  campos: Campo[] = [];
  camposEmpresa: Campo[] = [];

  constructor() {}

  ngOnInit(): void {
    this.usuariosService.associacaoAlteracao = undefined;
    this.usuario = this.usuariosService.usuarioAlteracao;

    if (this.usuario)
      this.usuariosService
        .getAssociacoes(this.usuariosService.usuarioAlteracao?.cdUsuario)
        .subscribe({
          next: (response) => {
            this.dataSource.data = response;
          },
          error: (err) => {
            this.snackBar.open('Erro ao buscar associações!', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed'],
            });
          },
        });

    this.campos = [
      {
        nome: 'cdUsuario',
        titulo: 'Código do Usuário',
        tipo: TipoCampo.texto,
        valor: this.usuario ? this.usuario.cdUsuario : undefined,
        obrigatorio: true,
        linha: 1,
        readonly: this.usuario ? true : false,
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
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        valor: this.usuario ? this.usuario.ativo : true,
        linha: 1,
      },
    ];

    this.camposEmpresa = [
      {
        nome: 'cdEmpresa',
        titulo: 'Empresa',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        listaObservable: this.usuariosService.getEmpresasAdm().pipe(
          map((response) =>
            response.map((x: Pessoa) => ({
              label: x.pessoaAux.nome,
              valor: x.cdPessoa,
            }))
          ),
          catchError((e: any) => {
            this.snackBar.open('Erro ao buscar empresas', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed'],
            });
            return of([]);
          })
        ),
      },
      {
        nome: 'cdPerfil',
        titulo: 'Perfil de Acesso',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        listaObservable: this.perfilAcessoService.getPerfisAcesso().pipe(
          map((response) =>
            response.map((x: PerfisAcesso) => ({
              label: x.nomePerfil,
              valor: x.cdPerfil,
            }))
          ),
          catchError((e: any) => {
            this.snackBar.open('Erro ao buscar perfis', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed'],
            });
            return of([]);
          })
        ),
      },
      {
        nome: 'dtValid',
        titulo: 'Data validade',
        tipo: TipoCampo.data,
        linha: 1,
      },
      {
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        linha: 1,
        valor: true,
      },
    ];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  columns = [
    {
      columnDef: 'nmEmpresa',
      header: 'Empresa',
      cell: (e: Associacao) => `${e.empresa.pessoaAux.nome}`,
    },
    {
      columnDef: 'nmPerfil',
      header: 'Perfil de acesso',
      cell: (e: Associacao) => `${e.perfil.nomePerfil}`,
    },
    {
      columnDef: 'ativo',
      header: 'Ativo',
      cell: (e: Associacao) => `${e.ativo}`,
    },
    {
      columnDef: 'validade',
      header: 'Validade',
      cell: (e: Associacao) => `${e.dtValid || ''}`,
    },
    {
      columnDef: 'funcoes',
      header: 'Funções',
      cell: () => ``,
    },
  ];

  dataSource: MatTableDataSource<Associacao> =
    new MatTableDataSource<Associacao>([]);
  displayedColumns = this.columns.map((c) => c.columnDef);

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
          this.usuario = response;
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

  associar(value: any): void {
    console.log(this.usuario);

    // Definir cdUsuario corretamente
    value.cdUsuario = this.usuariosService.usuarioAlteracao
      ? this.usuariosService.usuarioAlteracao.cdUsuario
      : this.usuario?.cdUsuario;

    this.usuariosService.associarEmpresa(value).subscribe({
      next: () => {
        this.snackBar.open('Usuário associado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-success'],
        });

        // Atualizar a lista de associações
        this.usuariosService.getAssociacoes(value.cdUsuario).subscribe({
          next: (response) => {
            this.dataSource.data = response;
          },
          error: () => {
            this.snackBar.open('Erro ao buscar associações!', 'Fechar', {
              duration: 3000,
              panelClass: ['snack-bar-failed'],
            });
          },
        });
      },
      error: () => {
        this.snackBar.open('Erro ao associar o usuário!', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-failed'],
        });
      },
    });
  }

  onEdit(row: Associacao) {
    this.usuariosService.associacaoAlteracao = row;
    this.formComponent.patchForm({
      cdEmpresa: row.cdEmpresa,
      cdPerfil: row.cdPerfil,
      dtValid: row.dtValid,
      ativo: row.ativo,
    });
  }

  clearForm() {
    this.usuariosService.associacaoAlteracao = undefined;
    this.formComponent.patchForm({
      cdEmpresa: undefined,
      cdPerfil: undefined,
      dtValid: undefined,
      ativo: true,
    });
  }

  alterarAssociacao() {
    if (!this.usuariosService.associacaoAlteracao) return;
    const value = this.formComponent.form.value;
    value.cdUsuario = this.usuariosService.usuarioAlteracao?.cdUsuario;
    this.usuariosService.alterarAssociacao(value).subscribe({
      next: (response: any) => {
        this.snackBar.open('Associação alterada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-success'],
        });
        this.usuariosService
          .getAssociacoes(this.usuariosService.usuarioAlteracao?.cdUsuario)
          .subscribe({
            next: (response) => {
              this.dataSource.data = response;
              this.clearForm();
            },
            error: (err) => {
              this.snackBar.open('Erro ao buscar associações!', 'Fechar', {
                duration: 3000,
                panelClass: ['snack-bar-failed'],
              });
            },
          });
      },
      error: (err: any) => {
        this.snackBar.open('Erro ao alterar a associação!', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-failed'],
        });
      },
    });
  }
}
