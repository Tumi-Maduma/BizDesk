import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    private apiUrl =
        'http://localhost:3000/api/tickets';


    constructor(
        private http: HttpClient
    ) {}


    getTickets() {

        return this.http.get<any[]>(
            this.apiUrl
        );

    }


    createTicket(ticket: any) {

        return this.http.post<any>(
            this.apiUrl,
            ticket
        );

    }


    getTicket(id: number) {

        return this.http.get<any>(
            `${this.apiUrl}/${id}`
        );

    }


    assignTicket(
        id: number,
        technicianId: number
    ) {

        return this.http.put<any>(
            `${this.apiUrl}/${id}/assign`,
            {
                technician_id: technicianId
            }
        );

    }

    updateTicketStatus(
        id: number,
        status: string
    ) {

        return this.http.put<any>(
            `${this.apiUrl}/${id}/status`,
            {
                status: status
            }
        );

    }

    getTicketHistory(id: number) {

        return this.http.get<any[]>(
            `${this.apiUrl}/${id}/history`
        );

    }

    getTicketComments(id: number) {

        return this.http.get<any[]>(
            `${this.apiUrl}/${id}/comments`
        );

    }


    createTicketComment(
        id: number,
        comment: string
    ) {

        return this.http.post<any>(
            `${this.apiUrl}/${id}/comments`,
            {
                comment: comment
            }
        );

    }

}