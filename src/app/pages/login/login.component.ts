import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component'; // Caminho correto para o input
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputComponent, MatButtonModule], // Importa o InputComponent e FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';  // Variável para armazenar o email
  password: string = '';  // Para senha
}
