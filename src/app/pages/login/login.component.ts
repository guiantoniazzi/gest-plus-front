import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TipoCampo } from '../../enum/tipoCampo';
import { FormComponent } from '../../components/form/form.component';
import { max } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatButtonModule, FormsModule, FormComponent], // Importa o InputComponent e FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) { }

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

  onSubmit(value: object): void {
    console.log(value);
  }
}
