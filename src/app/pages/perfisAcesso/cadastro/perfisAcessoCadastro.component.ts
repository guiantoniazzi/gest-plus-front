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
      nome: 'usuario',
      titulo: 'Usuário',
      tipo: TipoCampo.texto,
      obrigatorio: true,
      maximo: 8
    },
    {
      nome: 'senha',
      titulo: 'Senha',
      tipo: TipoCampo.senha,
      obrigatorio: true,
    },
  ];

  envio(value: any): void {
    
  }
}