import {
  Component,
  inject
} from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { ProjetoService } from '../projeto.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthService } from "../../../guard/auth.service";
import { Router } from "@angular/router";
import { PessoasService } from "../../pessoas/pessoas.service";
import { catchError, map, of } from "rxjs";
import { Pessoa } from "../../../models/pessoa";
import { Campo } from "../../../models/campo";
import { SituacaoProj } from "../../../models/situacaoProj";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Projeto } from "../../../models/projeto";


@Component({
  selector: 'app-projeto',

  imports: [
    FormComponent,
    MatButtonModule,
    FormsModule
  ],

  templateUrl: './projetoCadastro.component.html',

  styleUrl: './projetoCadastro.component.scss',
  host: { class: 'page' }

})
export class ProjetoCadastroComponent {
  private projetoService = inject(ProjetoService);
  private pessoasService = inject(PessoasService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() { }

  campos: Campo[] = [];

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
        change: 'changeCliente($event)'
      },
      {
        nome: 'tpProj',
        titulo: 'Tipo Projeto',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 2,
        lista: [{ label: 'Alocação', valor: 'A' }, { label: 'Projeto', valor: 'P' }],
      },
      {
        nome: 'cdRespProj',
        titulo: 'Responsável',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 2
      },
      {
        nome: 'nomeProj',
        titulo: 'Nome Projeto',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 40,
        linha: 1
      },
      {
        nome: 'idProjInterno',
        titulo: 'Identificação Interno',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        linha: 1
      },
      {
        nome: 'idProjCliente',
        titulo: 'Identificação Cliente',
        tipo: TipoCampo.texto,
        maximo: 20,
        linha: 1
      },
      {
        nome: 'dtInicioAvaliacao',
        titulo: 'Início Avaliação',
        tipo: TipoCampo.data,
        obrigatorio: true,
        linha: 3
      },
      {
        nome: 'dtInicioNegociacao',
        titulo: 'Início Negociação',
        tipo: TipoCampo.data,
        linha: 3
      },
      {
        nome: 'dtInicioPrevista',
        titulo: 'Início Prevista',
        tipo: TipoCampo.data,
        obrigatorio: true,
        linha: 4
      },
      {
        nome: 'dtFimPrevista',
        titulo: 'Fim Prevista',
        tipo: TipoCampo.data,
        linha: 4
      },
      {
        nome: 'qtdHrProj',
        titulo: 'Qtd. Horas',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 5
      },
      {
        nome: 'vlrHrProj',
        titulo: 'Valor Hora',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 5
      },
      {
        nome: 'vlrBaseProj',
        titulo: 'Valor Base',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 5
      },
      {
        nome: 'vlrDescontoComercial',
        titulo: 'Desconto Comercial',
        tipo: TipoCampo.texto,
        linha: 6
      },
      {
        nome: 'vlrAcrescimoProjeto',
        titulo: 'Acréscimo Projeto',
        tipo: TipoCampo.texto,
        linha: 6
      },
      {
        nome: 'vlrFinalProjeto',
        titulo: 'Valor Final',
        tipo: TipoCampo.texto,
        linha: 6
      },
      {
        nome: 'dtInicioProj',
        titulo: 'Início Projeto',
        tipo: TipoCampo.data,
        linha: 7
      },
      {
        nome: 'dtFimProj',
        titulo: 'Fim Projeto',
        tipo: TipoCampo.data,
        linha: 7
      },
      {
        nome: 'vlrFaturado',
        titulo: 'Valor Faturado',
        tipo: TipoCampo.texto,
        linha: 7
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
      },
    ];
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
        next: (value: Projeto) => {
          this.snackBar.open('Projeto cadastrado com sucesso!',
            'Fechar',
            {
              duration: 3000,

              panelClass: ['snack-bar-success']
            });
          this.projetoService.projetoAlteracao = value;
          this.router.navigate(['/projeto/detalhe']);
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
}