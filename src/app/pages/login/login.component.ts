import { Component, inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TipoCampo } from '../../enum/tipoCampo';
import { FormComponent } from '../../components/form/form.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { AuthService } from '../../guard/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatButtonModule, FormsModule, FormComponent], // Importa o InputComponent e FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


@Injectable({providedIn: 'root'})
export class LoginComponent {
  constructor(
    private authService: AuthService
  ) {}

  private http = inject(HttpClient);
  private router = inject(Router);

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
    this.http.post(`${environment.apiBaseUrl}${environment.endpoints.login.autenticar}`, value, {withCredentials: true}).subscribe({
      next: (value: any) => {
        this.authService.setLogin(value);
        this.router.navigate(['home']);
      },
      error(err) {
        console.error(err);
        alert('Usuário ou senha inválidos!');
        // this.router.navigate(['/login']);
      },
    });
  }
}
