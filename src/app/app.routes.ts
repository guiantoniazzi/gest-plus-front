import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PessoasComponent } from './pages/pessoas/pessoas.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'pessoas', component: PessoasComponent, canActivate: [AuthGuard]}
];
