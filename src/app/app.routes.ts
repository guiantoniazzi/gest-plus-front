import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PessoasComponent } from './pages/pessoas/consulta/pessoas.component';
import { AuthGuard } from './guard/auth.guard';
import { PerfisAcessoComponent } from './pages/perfisAcesso/consulta/perfisAcesso.component';
import { PerfisAcessoCadastroComponent } from './pages/perfisAcesso/cadastro/perfisAcessoCadastro.component';
import { PessoasCadastroComponent } from './pages/pessoas/cadastro/pessoasCadastro.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'pessoas', component: PessoasComponent, canActivate: [AuthGuard]},
    { path: 'pessoas/cadastro', component: PessoasCadastroComponent, canActivate: [AuthGuard] },
    { path: 'perfis-acesso', component: PerfisAcessoComponent, canActivate: [AuthGuard] },
    { path: 'perfis-acesso/cadastro', component: PerfisAcessoCadastroComponent, canActivate: [AuthGuard] }
];
