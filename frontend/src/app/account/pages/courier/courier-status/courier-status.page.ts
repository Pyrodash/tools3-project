import { Component, OnInit } from '@angular/core'
import { OrderService } from '../../../../order/order.service'
import { UserService, UserDetails } from '../../../../user/user.service'
import { Observable } from 'rxjs'
import { NgForOf, NgIf } from '@angular/common'
import { map } from 'rxjs/operators'
import { FormsModule } from '@angular/forms'
import { DetailedOrder, OrderStatus } from '../../../../order/order.service'
import { CommonModule } from '@angular/common'
import { AccountService, DetailedUser } from '../../../account.service'

@Component({
    selector: 'app-courier-status',
    standalone: true,
    imports: [NgForOf, NgIf, FormsModule, CommonModule],
    templateUrl: './courier-status.page.html',
})
export class CourierStatusComponent {
    orders$!: Observable<DetailedOrder[]> // Use Observable to fetch and display data in the template
    user$!: Observable<UserDetails> // Single object instead of an array
    statusOptions: OrderStatus[] = [
        'pending',
        'assigned',
        'accepted',
        'declined',
        'picked up',
        'in transit',
        'delivered',
    ]

    constructor(
        private orderService: OrderService,
        private userService: UserService,
        private accountService: AccountService,
    ) {}

    ngOnInit(): void {
        // Fetch drivers and then fetch orders once drivers are loaded
        this.userService.getAllDriversForDriver().subscribe(() => {
            this.getDriverOrders()
        })

        // Assign user$ as a single object, fetched from the AccountService
        this.user$ = this.accountService.fetchMyUser().pipe(
            map((detailedUser: DetailedUser) => ({
                ...detailedUser,
                role: detailedUser.role as 'driver',
            })),
        )
    }

    getDriverOrders(): void {
        this.user$.subscribe((user) => {
            if (user && user.id) {
                const driverId = user.id
                console.log('Driver ID found:', driverId) // Log driver ID for debugging

                // Fetch orders for the driver
                this.orders$ = this.orderService.getDriverOrders(driverId)

                // Handle case when no orders are returned
                this.orders$.subscribe(
                    (orders) => {
                        if (orders && orders.length > 0) {
                            console.log('Orders found:', orders) // Log orders for debugging
                        } else {
                            console.error('No orders found for this driver')
                        }
                    },
                    (error) => {
                        console.error('Error fetching orders:', error) // Handle API call errors
                    },
                )
            } else {
                console.error('Driver ID is undefined or user not found')
            }
        })
    }

    updateDriverOrderStatus(id: string, status: OrderStatus): void {
        // Call the service to update order status
        this.user$.subscribe((user) => {
            if (user && user.id) {
                this.orderService
                    .updateDriverOrderStatus(id, status, user.id)
                    .subscribe(() => {
                        // Reload the orders list or update the specific order locally if needed
                        this.getDriverOrders()
                    })
            } else {
                console.error('User ID is undefined or user not found')
            }
        })
    }
}