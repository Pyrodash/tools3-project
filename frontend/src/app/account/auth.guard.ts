import { inject, Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    RouterStateSnapshot,
} from '@angular/router'
import { AccountService } from './account.service'

@Injectable()
export class AuthGuard implements CanActivate {
    private accountService = inject(AccountService)

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): MaybeAsync<GuardResult> {
        if (this.accountService.isAuthenticated()) return true

        this.accountService.navigateToLogin()

        return false
    }
}
