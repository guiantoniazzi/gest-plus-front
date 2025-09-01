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


@Component({
  selector: 'app-projeto',

  imports: [
    FormComponent
  ],

  templateUrl: './projetoCadastro.component.html',

  styleUrl: './projetoCadastro.component.scss',

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
        change: 'changeCliente($event)'
      },
      {
        nome: 'tpProj',
        titulo: 'Tipo Projeto',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1,
        lista: [{ label: 'Alocação', valor: 'A' }, { label: 'Projeto', valor: 'P' }],
      },
      {
        nome: 'cdRespProj',
        titulo: 'Responsável',
        tipo: TipoCampo.select,
        obrigatorio: true,
        linha: 1
      },
      {
        nome: 'nomeProj',
        titulo: 'Nome Projeto',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 40,
        linha: 2
      },
      {
        nome: 'idProjInterno',
        titulo: 'Identificação Interno',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 20,
        linha: 2
      },
      {
        nome: 'idProjCliente',
        titulo: 'Identificação Cliente',
        tipo: TipoCampo.texto,
        maximo: 20,
        linha: 2
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
        linha: 3
      },
      {
        nome: 'dtFimPrevista',
        titulo: 'Fim Prevista',
        tipo: TipoCampo.data,
        linha: 3
      },
      {
        nome: 'qtdHrProj',
        titulo: 'Qtd. Horas',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 4
      },
      {
        nome: 'vlrHrProj',
        titulo: 'Valor Hora',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 4
      },
      {
        nome: 'vlrBaseProj',
        titulo: 'Valor Base',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        linha: 4
      },
      {
        nome: 'vlrDescontoComercial',
        titulo: 'Desconto Comercial',
        tipo: TipoCampo.texto,
        linha: 5
      },
      {
        nome: 'vlrAcrescimoProjeto',
        titulo: 'Acréscimo Projeto',
        tipo: TipoCampo.texto,
        linha: 5
      },
      {
        nome: 'vlrFinalProjeto',
        titulo: 'Valor Final',
        tipo: TipoCampo.texto,
        linha: 5
      },
      {
        nome: 'dtInicioProj',
        titulo: 'Início Projeto',
        tipo: TipoCampo.data,
        linha: 6
      },
      {
        nome: 'dtFimProj',
        titulo: 'Fim Projeto',
        tipo: TipoCampo.data,
        linha: 6
      },
      {
        nome: 'vlrFaturado',
        titulo: 'Valor Faturado',
        tipo: TipoCampo.texto,
        linha: 6
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
}