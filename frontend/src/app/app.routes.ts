import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { authGuard } from './guards/auth.guard';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { UsersComponent } from './users/users.component';
import { adminGuard } from './guards/admin.guard';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },

    {
        path: 'users',
        component: UsersComponent,
        canActivate: [adminGuard]
    },
    
    {
        path: 'tickets',
        component: TicketsComponent,
        canActivate: [authGuard]
    },

    {
        path: 'tickets/:id',
        component: TicketDetailsComponent,
        canActivate: [authGuard]
    },

    {
        path: 'knowledge-base',
        component: KnowledgeBaseComponent,
        canActivate: [authGuard]
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: '**',
        redirectTo: 'login'
    }

];