import { Component, inject, Input } from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { PerfisAcesso } from "../../../models/perfisAcesso";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfisAcessoCadastro',
  imports: [
    FormComponent
  ],
  templateUrl: './perfisAcessoCadastro.component.html',
  styleUrl: './perfisAcessoCadastro.component.scss',
})
export class PerfisAcessoCadastroComponent {
  @Input() perfilAcesso!: PerfisAcesso;

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.perfilAcesso = navigation?.extras.state?.['perfilAcesso'];
    console.log('Perfil recebido:', this.perfilAcesso);
  }

  campos = [
    {
      nome: 'nmPerfil',
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
      tipo: TipoCampo.checkbox,
      valor: this.perfilAcesso ? this.perfilAcesso.ativo : true,
      linha: 1,
    },
    {
      nome: 'funcoes',
      titulo: 'Funções do Sistema',
      tipo: TipoCampo.multiselect,
      valor: this.perfilAcesso ? this.perfilAcesso.funcoes : undefined,
      linha: 1,
    },
  ];

  envio(value: any): void {
    
  }
}