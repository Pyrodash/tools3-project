import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AccountService {
    private static TOKEN_KEY = 'token'

    private http = inject(HttpClient)
    private router = inject(Router)

    public get token(): string | null {
        return localStorage.getItem(AccountService.TOKEN_KEY)
    }

    private set token(token: string) {
        localStorage.setItem(AccountService.TOKEN_KEY, token)
    }

    public isAuthenticated(): boolean {
        return Boolean(this.token) // todo: check token expiry
    }

    login(email: string, password: string) {
        return this.http.post('/auth/login', { email, password }).pipe(
            tap((user) => {
                // this.token = x
            }),
        )
    }

    // register() {}

    logout() {
        localStorage.removeItem(AccountService.TOKEN_KEY)
        this.navigateToLogin()
    }

    navigateToLogin() {
        this.router.navigate(['login'])
    }
}
