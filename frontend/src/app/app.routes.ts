import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.page'
import { AuthComponent } from './account/pages/auth/auth.page'
import { NotFoundComponent } from './ui/pages/notfound/notfound.page'
import { AuthGuard, GuestOnlyGuard } from './account/auth.guard'
import { LogoutComponent } from './account/pages/logout/logout.page'
import { AccountResolver } from './account/account.resolver'
import { DashboardComponent } from './dashboard/dashboard.page'
import { AdminComponent } from './account/pages/admin/admin.page'
import { AdminOrderComponent } from './account/pages/admin/admin-order/admin-order.page'
import { AdminUserComponent } from './account/pages/admin/admin-user/admin-user.page'
import { CourierComponent } from './account/pages/courier/courier.page'
import { CourierOrderComponent } from './account/pages/courier/courier-order/courier-order.page'
import { CourierStatusComponent } from './account/pages/courier/courier-status/courier-status.page'

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
                path: 'admin',
                component: AdminComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'orders',
                        component: AdminOrderComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'users',
                        component: AdminUserComponent,
                        canActivate: [AuthGuard],
                    },
                ],
            },
            {
                path: 'courier',
                component: CourierComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'orders',
                        component: CourierOrderComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'status',
                        component: CourierStatusComponent,
                        canActivate: [AuthGuard],
                    },
                ],
            },
            {
                path: '**',
                pathMatch: 'full',
                component: NotFoundComponent,
            },
        ],
    },
]
