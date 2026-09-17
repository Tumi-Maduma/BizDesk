import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    private apiUrl = 'http://localhost:3000/api/tickets';

    constructor(private http: HttpClient) {}

    getTickets() {
        return this.http.get<any[]>(this.apiUrl);
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
}