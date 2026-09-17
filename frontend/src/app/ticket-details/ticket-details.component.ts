import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TicketService } from '../services/ticket.service';

@Component({
    selector: 'app-ticket-details',
    imports: [CommonModule],
    templateUrl: './ticket-details.component.html',
    styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit {

    ticket: any = null;

    loading = true;

    errorMessage = '';


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ticketService: TicketService
    ) {}


    ngOnInit(): void {

        const id = Number(
            this.route.snapshot.paramMap.get('id')
        );


        if (!id) {

            this.errorMessage =
                'Invalid ticket ID.';

            this.loading = false;

            return;

        }


        this.loadTicket(id);

    }


    loadTicket(id: number): void {

        this.ticketService.getTicket(id)
            .subscribe({

                next: (response) => {

                    this.ticket = response;

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Error loading ticket:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ||
                        'Unable to load ticket.';

                    this.loading = false;

                }

            });

    }


    goBack(): void {

        this.router.navigate(['/tickets']);

    }

}