import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http'
import { catchError, Observable, throwError } from 'rxjs'
import { AuthService } from '../account/account.service'
import { inject } from '@angular/core'

// single responsibility is violated by this interceptor
// maybe split this up into multiple interceptors (api/base url & auth header & error handler)

export function apiInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService)
    const authorization =
        authService.token !== null ? `Bearer ${authService.token}` : ''

    const newRequest = req.clone({
        url: `${import.meta.env.NG_APP_API_URL}${req.url}`,
        headers: req.headers.set('Authorization', authorization),
    })

    return next(newRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.logout()
            }

            return throwError(() => error)
        }),
    )
}
