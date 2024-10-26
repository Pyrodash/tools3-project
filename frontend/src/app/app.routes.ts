import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.page'
import { AuthComponent } from './account/pages/auth/auth.page'

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: AuthComponent },
    // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
]
