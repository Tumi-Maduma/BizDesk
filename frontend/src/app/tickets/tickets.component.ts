import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService } from '../services/ticket.service';

@Component({
    selector: 'app-tickets',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './tickets.component.html',
    styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {

    tickets: any[] = [];

    filteredTickets: any[] = [];

    loading = true;

    errorMessage = '';

    successMessage = '';

    showCreateForm = false;

    creatingTicket = false;


    title = '';

    description = '';

    category = '';

    priority = 'MEDIUM';


    // =========================
    // FILTERS
    // =========================

    searchTerm = '';

    statusFilter = '';

    priorityFilter = '';

    sortOption = 'newest';

    constructor(
        private ticketService: TicketService,
        private router: Router
    ) {}


    ngOnInit(): void {

        this.loadTickets();

    }


    loadTickets(): void {

        this.loading = true;

        this.ticketService.getTickets()
            .subscribe({

                next: (response) => {

                    this.tickets = response;

                    this.filteredTickets =
                        [...this.tickets];

                    this.sortTickets();

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Error loading tickets:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load tickets.';

                    this.loading = false;

                }

            });

    }


    // =========================
    // FILTER TICKETS
    // =========================

    filterTickets(): void {

        const search =
            this.searchTerm
                .trim()
                .toLowerCase();


        this.filteredTickets =
            this.tickets.filter(ticket => {

                const matchesSearch =
                    !search ||
                    ticket.ticket_number
                        ?.toLowerCase()
                        .includes(search) ||
                    ticket.title
                        ?.toLowerCase()
                        .includes(search);


                const matchesStatus =
                    !this.statusFilter ||
                    ticket.status === this.statusFilter;


                const matchesPriority =
                    !this.priorityFilter ||
                    ticket.priority === this.priorityFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );

            });


        this.sortTickets();

    }

    sortTickets(): void {

        const priorityOrder: any = {

            CRITICAL: 1,

            HIGH: 2,

            MEDIUM: 3,

            LOW: 4

        };


        const statusOrder: any = {

            OPEN: 1,

            ASSIGNED: 2,

            IN_PROGRESS: 3,

            RESOLVED: 4,

            CLOSED: 5

        };


        this.filteredTickets.sort(
            (a, b) => {

                switch (this.sortOption) {

                    case 'oldest':

                        return (
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                        );


                    case 'priority':

                        return (
                            priorityOrder[a.priority] -
                            priorityOrder[b.priority]
                        );


                    case 'status':

                        return (
                            statusOrder[a.status] -
                            statusOrder[b.status]
                        );


                    case 'newest':

                    default:

                        return (
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        );

                }

            }
        );

    }

    clearFilters(): void {

        this.searchTerm = '';

        this.statusFilter = '';

        this.priorityFilter = '';

        this.sortOption = 'newest';

        this.filteredTickets =
            [...this.tickets];

        this.sortTickets();

    }


    openCreateForm(): void {

        this.showCreateForm = true;

        this.clearMessages();

    }


    closeCreateForm(): void {

        this.showCreateForm = false;

        this.resetForm();

        this.clearMessages();

    }


    createTicket(): void {

        this.clearMessages();


        if (
            !this.title ||
            !this.description ||
            !this.category
        ) {

            this.errorMessage =
                'Please complete all required fields.';

            return;

        }


        this.creatingTicket = true;


        const ticket = {

            title: this.title,

            description: this.description,

            category: this.category,

            priority: this.priority

        };


        this.ticketService.createTicket(ticket)
            .subscribe({

                next: (response) => {

                    console.log(
                        'Ticket created:',
                        response
                    );


                    this.successMessage =
                        `Ticket ${response.ticket_number} created successfully.`;


                    this.creatingTicket = false;

                    this.showCreateForm = false;

                    this.resetForm();

                    this.loadTickets();

                },


                error: (error) => {

                    console.error(
                        'Error creating ticket:',
                        error
                    );


                    this.errorMessage =
                        error.error?.message ||
                        'Unable to create ticket.';


                    this.creatingTicket = false;

                }

            });

    }


    resetForm(): void {

        this.title = '';

        this.description = '';

        this.category = '';

        this.priority = 'MEDIUM';

    }


    clearMessages(): void {

        this.errorMessage = '';

        this.successMessage = '';

    }


    viewTicket(id: number): void {

        this.router.navigate([
            '/tickets',
            id
        ]);

    }

}