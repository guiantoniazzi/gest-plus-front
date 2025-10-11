import { Component, inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TipoCampo } from '../../enum/tipoCampo';
import { FormComponent } from '../../components/form/form.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { AuthService } from '../../guard/auth.service';
import { AppComponent } from '../../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatButtonModule, FormComponent], // Importa o InputComponent e FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})


@Injectable({providedIn: 'root'})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private appComponent: AppComponent
  ) {}

  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  campos = [
    {
      nome: 'usuario',
      titulo: 'Usuário',
      tipo: TipoCampo.texto,
      obrigatorio: true,
      maximo: 8,
      linha: 1
    },
    {
      nome: 'senha',
      titulo: 'Senha',
      tipo: TipoCampo.senha,
      obrigatorio: true,
      linha: 2
    },
  ];

  envio(value: any): void {
    this.http.post(`${process.env['API_URL']}${environment.endpoints.login.autenticar}`, value, {withCredentials: true}).subscribe({
      next: (value: any) => {
        this.authService.setLogin(value);
        this.appComponent.carregarEmpresas();
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.snackBar.open('Usuário ou senha inválidos!', 'Fechar', {
          duration: 3000,
          panelClass: ['snack-bar-failed']
        });
      },
    });
  }
}
