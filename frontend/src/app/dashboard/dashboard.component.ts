import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    user: any;

    constructor(private authService: AuthService) {
        this.user = this.authService.getUser();
    }

    logout(): void {
        this.authService.logout();

        window.location.reload();
    }
}