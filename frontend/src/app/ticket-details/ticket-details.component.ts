import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TicketService } from '../services/ticket.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-ticket-details',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './ticket-details.component.html',
    styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit {

    ticket: any = null;

    history: any[] = [];

    historyLoading = true;

    comments: any[] = [];

    commentsLoading = true;

    newComment = '';

    addingComment = false;

    commentError = '';

    technicians: any[] = [];

    selectedTechnician = '';

    loading = true;

    assigning = false;

    errorMessage = '';

    successMessage = '';

    isAdmin = false;
    
    isTechnician = false;

    updatingStatus = false;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ticketService: TicketService,
        private userService: UserService,
        private authService: AuthService
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


        const user =
            this.authService.getUser();


            this.isAdmin =
                user?.role === 'ADMIN';

            this.isTechnician =
                user?.role === 'TECHNICIAN';


        this.loadTicket(id);

        this.loadHistory(id);

        this.loadComments(id);

        if (this.isAdmin) {

            this.loadTechnicians();

        }

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

    loadHistory(id: number): void {

    this.historyLoading = true;

    this.ticketService.getTicketHistory(id)
        .subscribe({

            next: (response) => {

                this.history = response;

                this.historyLoading = false;

            },

            error: (error) => {

                console.error(
                    'Error loading ticket history:',
                    error
                );

                this.history = [];

                this.historyLoading = false;

            }

        });

}

    loadComments(id: number): void {

        this.commentsLoading = true;

        this.ticketService.getTicketComments(id)
            .subscribe({

                next: (response) => {

                    this.comments = response;

                    this.commentsLoading = false;

                },

                error: (error) => {

                    console.error(
                        'Error loading ticket comments:',
                        error
                    );

                    this.comments = [];

                    this.commentsLoading = false;

                }

            });

    }

    addComment(): void {

        this.commentError = '';

        const comment =
            this.newComment.trim();


        if (!comment) {

            this.commentError =
                'Please enter a comment.';

            return;

        }


        this.addingComment = true;


        this.ticketService.createTicketComment(
            this.ticket.id,
            comment
        )
        .subscribe({

            next: () => {

                this.newComment = '';

                this.addingComment = false;

                this.loadComments(
                    this.ticket.id
                );

            },

            error: (error) => {

                console.error(
                    'Error creating comment:',
                    error
                );

                this.commentError =
                    error.error?.message ||
                    'Unable to add comment.';

                this.addingComment = false;

            }

        });

    }

    loadTechnicians(): void {

        this.userService.getTechnicians()
            .subscribe({

                next: (response) => {

                    this.technicians =
                        response;

                },

                error: (error) => {

                    console.error(
                        'Error loading technicians:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load technicians.';

                }

            });

    }


    assignTicket(): void {

        if (!this.selectedTechnician) {

            this.errorMessage =
                'Please select a technician.';

            return;

        }


        this.errorMessage = '';

        this.successMessage = '';

        this.assigning = true;


        this.ticketService.assignTicket(
            this.ticket.id,
            Number(this.selectedTechnician)
        )

        
        .subscribe({

            next: (response) => {

                this.ticket = {
                    ...this.ticket,
                    ...response.ticket
                };


                this.successMessage =
                    'Ticket assigned successfully.';


                this.assigning = false;

                this.selectedTechnician = '';


                this.loadTicket(
                    this.ticket.id
                );

                this.loadHistory(
                    this.ticket.id
                );

            },

            error: (error) => {

                console.error(
                    'Error assigning ticket:',
                    error
                );


                this.errorMessage =
                    error.error?.message ||
                    'Unable to assign ticket.';


                this.assigning = false;

            }

        });

    }


    updateStatus(status: string): void {

        this.errorMessage = '';

        this.successMessage = '';

        this.updatingStatus = true;

        this.loadHistory(
            this.ticket.id
        );

        this.ticketService.updateTicketStatus(
            this.ticket.id,
            status
        )
        .subscribe({

            next: (response) => {

                this.ticket = {
                    ...this.ticket,
                    ...response.ticket
                };


                this.successMessage =
                    'Ticket status updated successfully.';


                this.updatingStatus = false;

            },


            error: (error) => {

                console.error(
                    'Error updating ticket status:',
                    error
                );


                this.errorMessage =
                    error.error?.message ||
                    'Unable to update ticket status.';


                this.updatingStatus = false;

            }

        });

    }

    goBack(): void {

        this.router.navigate(['/tickets']);

    }

}