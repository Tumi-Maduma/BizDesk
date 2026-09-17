import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    email = '';
    password = '';
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    login(): void {

        this.errorMessage = '';

        this.authService.login(this.email, this.password)
            .subscribe({
                next: (response: any) => {

                    localStorage.setItem('token', response.token);
                    localStorage.setItem(
                        'user',
                        JSON.stringify(response.user)
                    );

                    this.router.navigate(['/dashboard']);
                },

                error: (error) => {

                    this.errorMessage =
                        error.error?.message ||
                        'Login failed. Please try again.';
                }
            });
    }
}