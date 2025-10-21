import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
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
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './guard/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Empresa } from './models/permissoesLogin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

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
    ReactiveFormsModule,
    MatTabsModule
  ],
})
export class AppComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);

  @ViewChild(MatDrawer) drawer!: MatDrawer;
  
  telasSemMenu = true;
  isDarkMode = false;
  collapsed = false;
  
  rotas: Rotas[] = DEFAULT_ROTAS.filter(
    (rota) => rota.visivel
  );
  
  page!: string;
  
  empresas: Empresa[] = [];
  selectedEmpresa = null;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, public authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.page = DEFAULT_ROTAS.find((rota) => rota.link == event.url)?.label!;
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
    this.verificarToken();
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
    if(!this.authService.verificaRedirect(this.router.url)) {
      this.router.navigate(['home']);
    }
    else {
      var url = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([url]);
      });
    }
  }

  drawerClick() {
    this.collapsed = !this.collapsed;
    document.getElementsByClassName('page')[0].classList.toggle('sidenav-collapsed');
  }

  verificarToken() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLogin = window.sessionStorage.getItem('permissoesLogin');
      if (savedLogin) {
        this.authService.setLogin(JSON.parse(savedLogin));
      }
    }
  }
}
