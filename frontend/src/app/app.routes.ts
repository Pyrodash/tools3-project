import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.page'
import { AuthComponent } from './account/pages/auth/auth.page'
import { NotFoundComponent } from './ui/pages/notfound/notfound.page'
import { AuthGuard, GuestOnlyGuard } from './account/auth.guard'
import { LogoutComponent } from './account/pages/logout/logout.page'
import { AccountResolver } from './account/account.resolver'
import { DashboardComponent } from './dashboard/dashboard.page'

export const routes: Routes = [
    {
        path: '',
        resolve: { user: AccountResolver },
        children: [
            { path: '', component: HomeComponent },
            {
                path: 'login',
                component: AuthComponent,
                canActivate: [GuestOnlyGuard],
            },
            {
                path: 'logout',
                component: LogoutComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard],
            },
            {
                path: '**',
                pathMatch: 'full',
                component: NotFoundComponent,
            },
        ],
    },
]
