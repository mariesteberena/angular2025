import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InternasComponent } from './pages/internas/internas.component';
import { VisitantesComponent } from './pages/visitantes/visitantes.component';
import { VisitasComponent } from './pages/visitas/visitas.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'internas', component: InternasComponent, canActivate: [AuthGuard] },
  { path: 'visitantes', component: VisitantesComponent, canActivate: [AuthGuard] },
  { path: 'visitas', component: VisitasComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];