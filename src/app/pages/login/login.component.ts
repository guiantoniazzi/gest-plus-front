import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component'; // Caminho correto para o input
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputComponent, MatButtonModule, FormsModule], // Importa o InputComponent e FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}
  email: string = '';  // Variável para armazenar o email
  password: string = '';  // Para senha

  onSubmit()
  {
    this.router.navigate(['/home'])
  }
}
