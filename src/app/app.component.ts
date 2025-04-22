import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Rotas } from './models/rotas';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, MatSidenavModule, MatListModule]
})
export class AppComponent {

  telasSemMenu = true;
  isDarkMode = false;

  rotas: Rotas[] = [{
    link: '/home',
    label: 'Home',
    icon: 'home'
  },
  {
    link: '/pessoas',
    label: 'Pessoas',
    icon: 'groups'
  },
  {
    link: '/projetos',
    label: 'Projetos',
    icon: 'bar_chart'
  },
  {
    link: '/configuracoes',
    label: 'Configurações',
    icon: 'settings'
  }];
  
  page!: string;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.page = this.rotas.find(rota => rota.link == event.url)?.label!;
        const noBarRoutes = ['/', '/login'];
        this.telasSemMenu = !noBarRoutes.includes(event.urlAfterRedirects);
      }
    });
  }

  ChangeTheme() {
    this.isDarkMode = !this.isDarkMode;
    // document.body.classList.toggle('dark-theme', this.isDarkMode);
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(this.isDarkMode ? 'dark-theme' : 'light-theme');
  }

  logout() {
    this.router.navigate(['/login']);
  }
}



