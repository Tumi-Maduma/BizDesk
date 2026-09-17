import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-users',
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

    users: any[] = [];

    loading = true;

    errorMessage = '';

    successMessage = '';

    showCreateForm = false;

    creatingUser = false;


    fullName = '';

    email = '';

    password = '';

    role = 'EMPLOYEE';

    department = '';


    constructor(
        private userService: UserService
    ) {}


    ngOnInit(): void {

        this.loadUsers();

    }


    loadUsers(): void {

        this.loading = true;

        this.userService.getUsers()
            .subscribe({

                next: (response) => {

                    this.users = response;

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Error loading users:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ||
                        'Unable to load users.';

                    this.loading = false;

                }

            });

    }


    openCreateForm(): void {

        this.clearMessages();

        this.showCreateForm = true;

    }


    closeCreateForm(): void {

        this.showCreateForm = false;

        this.resetForm();

        this.clearMessages();

    }


    createUser(): void {

        this.clearMessages();


        if (
            !this.fullName ||
            !this.email ||
            !this.password
        ) {

            this.errorMessage =
                'Please complete all required fields.';

            return;

        }


        this.creatingUser = true;


        const user = {

            full_name: this.fullName,

            email: this.email,

            password: this.password,

            role: this.role,

            department: this.department

        };


        this.userService.createUser(user)
            .subscribe({

                next: (response) => {

                    console.log(
                        'User created:',
                        response
                    );


                    this.successMessage =
                        `${response.full_name} was created successfully.`;


                    this.creatingUser = false;

                    this.showCreateForm = false;

                    this.resetForm();

                    this.loadUsers();

                },


                error: (error) => {

                    console.error(
                        'Error creating user:',
                        error
                    );


                    this.errorMessage =
                        error.error?.message ||
                        'Unable to create user.';


                    this.creatingUser = false;

                }

            });

    }


    resetForm(): void {

        this.fullName = '';

        this.email = '';

        this.password = '';

        this.role = 'EMPLOYEE';

        this.department = '';

    }


    clearMessages(): void {

        this.errorMessage = '';

        this.successMessage = '';

    }

}