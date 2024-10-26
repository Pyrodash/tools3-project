import { Component, inject } from '@angular/core'
import { AccountService } from '../account/account.service'

@Component({
    standalone: true,
    templateUrl: './dashboard.page.html',
})
export class DashboardComponent {
    accountService = inject(AccountService)
}
