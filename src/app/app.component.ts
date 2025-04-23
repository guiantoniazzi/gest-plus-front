import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  ],
})
export class AppComponent {
  telasSemMenu = true;
  isDarkMode = false;

  rotas: Rotas[] = DEFAULT_ROTAS

  page!: string;
  
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.page = this.rotas.find((rota) => rota.link == event.url)?.label!;
        const noBarRoutes = ['/', '/login'];
        this.telasSemMenu = !noBarRoutes.includes(event.urlAfterRedirects);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  VerificaRenderizacao(rota: Rotas): boolean {
    return this.authService.verificaNavegacao(rota);
  }
}
