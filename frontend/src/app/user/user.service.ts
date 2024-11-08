import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AccountService } from '../account/account.service'
import { BehaviorSubject, Observable, EMPTY } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

export type UserRole = 'seller' | 'driver' | 'admin'

export interface user {
    id: string
    name: string
}

export interface userdetails extends user {
    role: UserRole
}

@Injectable({
    providedIn: 'root',
})
export class UserComponent {
    private usersSubject = new BehaviorSubject<userdetails[]>([])
    orders$ = this.usersSubject.asObservable()

    constructor(
        private router: Router,
        private http: HttpClient,
        private accountService: AccountService,
    ) {}

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.accountService.token}`,
        })
    }

    getAllDrivers(): Observable<userdetails[]> {
        return this.http
            .get<userdetails[]>('/admin/drivers', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((users) => {
                    this.usersSubject.next(users)
                }),
                catchError((error) => {
                    console.error('Error fetching drivers', error)
                    return EMPTY
                }),
            )
    }
}
