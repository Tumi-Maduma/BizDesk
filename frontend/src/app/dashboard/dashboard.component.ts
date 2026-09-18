import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule } from '@angular/common';

import {
    RouterLink,
    RouterLinkActive
} from '@angular/router';

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

    user: any;

    statistics: any = null;

    loading = true;

    errorMessage = '';


    constructor(
        private authService: AuthService,
        private dashboardService: DashboardService
    ) {

        this.user =
            this.authService.getUser();

    }


    ngOnInit(): void {

        this.loadStatistics();

    }


    loadStatistics(): void {

        this.dashboardService
            .getStatistics()
            .subscribe({

                next: (response) => {

                    this.statistics = response;

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Error loading dashboard statistics:',
                        error
                    );

                    this.errorMessage =
                        'Failed to load dashboard statistics.';

                    this.loading = false;

                }

            });

    }


    logout(): void {

        this.authService.logout();

        window.location.reload();

    }

}