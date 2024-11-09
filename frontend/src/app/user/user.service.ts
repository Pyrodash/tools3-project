import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AccountService } from '../account/account.service'
import { BehaviorSubject, Observable, EMPTY } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { jwtDecode } from 'jwt-decode'

export type UserRole = 'seller' | 'driver' | 'admin'

export interface User {
    id: string
    name: string
}

export interface UserDetails extends User {
    role: UserRole
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // Changed class name to be more consistent with Angular services
    private usersSubject = new BehaviorSubject<UserDetails[]>([])
    users$ = this.usersSubject.asObservable()

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

    getAllDrivers(): Observable<UserDetails[]> {
        return this.http
            .get<UserDetails[]>('/admin/drivers', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((users) => this.usersSubject.next(users)),
                catchError((error) => {
                    console.error('Error fetching drivers', error)
                    return EMPTY
                }),
            )
    }

    getAllDriversForDriver(): Observable<UserDetails[]> {
        return this.http
            .get<UserDetails[]>('/courier/drivers', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((users) => this.usersSubject.next(users)),
                catchError((error) => {
                    console.error('Error fetching drivers', error)
                    return EMPTY
                }),
            )
    }

    getUserID(): string {
        const token = this.accountService.token
        if (!token) return ''

        try {
            interface DecodedToken {
                userId: string
                [key: string]: unknown
            }
            const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token)
            return decodedToken.userId || ''
        } catch (error) {
            console.error('Error decoding token:', error)
            return ''
        }
    }

    getUserDetails(): Observable<UserDetails> {
        return this.http
            .get<UserDetails>(`/user/@me`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error('Error fetching user details', error)
                    return EMPTY
                }),
            )
    }
}
