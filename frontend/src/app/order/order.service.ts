import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AccountService } from '../account/account.service'
import { BehaviorSubject, Observable, of, EMPTY } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

export type OrderStatus =
    | 'pending'
    | 'assigned'
    | 'accepted'
    | 'declined'
    | 'picked up'
    | 'in transit'
    | 'delivered'

interface Location {
    city: string
    address: string
}

interface Item {
    name: string
    quantity: number
}

export interface Order {
    id: string
    status: OrderStatus
}

export interface DetailedOrder extends Order {
    sellerId: string
    driverId: string
    pickupLocation: Location
    destination: Location
    deliveryTime: string
    receiverPhone: string
    totalWeight: number
    items: Item[]
}
@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private ordersSubject = new BehaviorSubject<DetailedOrder[]>([])
    orders$ = this.ordersSubject.asObservable()

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

    public getStatus(order: DetailedOrder): string {
        return order.status
    }

    getOrders(): Observable<DetailedOrder[]> {
        return this.http
            .get<DetailedOrder[]>('/admin/all', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((orders) => this.ordersSubject.next(orders)),
                catchError((error) => {
                    console.error('Error fetching orders', error)
                    return of([])
                }),
            )
    }

    getUserOrders(): Observable<DetailedOrder[]> {
        return this.http
            .get<DetailedOrder[]>('/orders/all', {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                tap((orders) => this.ordersSubject.next(orders)),
                catchError((error) => {
                    console.error('Error fetching orders', error)
                    return of([])
                }),
            )
    }

    getOrderById(id: string): Observable<DetailedOrder> {
        return this.http
            .get<DetailedOrder>(`/admin/orders/${id}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(`Error fetching order with ID ${id}`, error)
                    return of(null as unknown as DetailedOrder)
                }),
            )
    }

<<<<<<< HEAD
    getOrderByIdForUser(id: string): Observable<DetailedOrder> {
        return this.http
            .get<DetailedOrder>(`/orders/${id}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(`Error fetching order with ID ${id}`, error)
                    return of(null as unknown as DetailedOrder)
                }),
            )
    }

    cancelOrderByIdForUser(id: string): Observable<DetailedOrder> {
        return this.http
            .delete<DetailedOrder>(`/orders/${id}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(`Error Deleting order with ID ${id}`, error)
                    return of(null as unknown as DetailedOrder)
                }),
            )
    }

=======
    //this is the wrong endpoint
    //TODO: change the endpoint to the correct one
>>>>>>> cdd8e0afe5a752829bd90aebb9c764f90312a931
    addOrder(order: DetailedOrder): Observable<DetailedOrder> {
        return this.http
            .post<DetailedOrder>('/orders/create', order, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error('Error adding order', error)
                    return of(null as unknown as DetailedOrder)
                }),
            )
    }

    updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
        return this.http
            .put<void>(
                `/admin/orders/${id}`,
                { status },
                {
                    headers: this.getAuthHeaders(),
                },
            )
            .pipe(
                catchError((error) => {
                    console.error(
                        `Error updating status for order with ID ${id}`,
                        error,
                    )
                    return EMPTY
                }),
            )
    }

    updateOrderDriver(id: string, driverId: string): Observable<void> {
        return this.http
            .put<void>(
                `/admin/orders/assign/${id}`,
                { driverId },
                {
                    headers: this.getAuthHeaders(),
                },
            )
            .pipe(
                catchError((error) => {
                    console.error(
                        `Error updating driver for order with ID ${id}`,
                        error,
                    )
                    return EMPTY
                }),
            )
    }

    driverCancelOrder(id: string): Observable<void> {
        return this.http
            .put<void>(`/courier/cancel/${id}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(`Error cancelling order with ID ${id}`, error)
                    return EMPTY
                }),
            )
    }

    deleteOrder(id: string): Observable<void> {
        return this.http
            .delete<void>(`/admin/orders/${id}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(
                        `Failed to delete order with ID: ${id}`,
                        error,
                    )
                    return EMPTY
                }),
            )
    }

    getDriverOrders(driverId: string): Observable<DetailedOrder[]> {
        return this.http
            .get<DetailedOrder[]>(`/courier/assigned/${driverId}`, {
                headers: this.getAuthHeaders(),
            })
            .pipe(
                catchError((error) => {
                    console.error(
                        `Error fetching orders for driver ${driverId}`,
                        error,
                    )
                    return of([])
                }),
            )
    }

    updateDriverOrderStatus(
        id: string,
        status: OrderStatus,
        driverId: string,
    ): Observable<void> {
        return this.http
            .put<void>(
                `/courier/orders/${id}`,
                { status, driverId },
                {
                    headers: this.getAuthHeaders(),
                },
            )
            .pipe(
                catchError((error) => {
                    console.error(
                        `Error updating status for order with ID ${id}`,
                        error,
                    )
                    return EMPTY
                }),
            )
    }
}
