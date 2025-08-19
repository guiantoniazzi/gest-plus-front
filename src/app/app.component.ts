import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DEFAULT_ROTAS, Rotas } from './models/rotas';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './guard/auth.service';
import { Funcionalidade } from './enum/funcionalidade';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Empresa } from './models/permissoesLogin';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class AppComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  telasSemMenu = true;
  isDarkMode = false;

  rotas: Rotas[] = DEFAULT_ROTAS.filter(
    (rota) => rota.visivel
  );

  page!: string;
  
  empresas: Empresa[] = [];
  selectedEmpresa = null;

  constructor(private router: Router, public authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.page = this.rotas.find((rota) => rota.link == event.url)?.label!;
        const noBarRoutes = ['/', '/login'];
        this.telasSemMenu = !noBarRoutes.includes(event.urlAfterRedirects);

        if(!authService.verificaRedirect(event.urlAfterRedirects)) {
          this.router.navigate(['home']);
        }
      }
    });
  }

  ngOnInit() {
    this.carregarEmpresas();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  VerificaRenderizacao(rota: Rotas): boolean {
    return this.authService.verificaNavegacao(rota);
  }

  carregarEmpresas() {
    this.empresas = this.authService.getLogin()?.empresa;
  }
  
  changeEmpresa(event: MatSelectChange) {
    this.authService.empresaSelected = event.value;
    this.router.navigate([this.router.url]);
    if(!this.authService.verificaRedirect(this.router.url)) {
      this.router.navigate(['home']);
    }
  }
}
