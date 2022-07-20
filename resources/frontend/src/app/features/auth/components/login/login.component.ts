import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router"
interface success {
    message: String;
    token: String;
}
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
    isLoading = false;
    credentials = {
        email: '',
        password: '',
    };
    passwordVisible = false;
    password?: string;
    constructor(
        private service: AuthService,
        private message: NzMessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        localStorage.removeItem('token');
    }

    login() {
        this.isLoading = true;
        this.service.login(this.credentials).subscribe(
            {
                next: (response: any) => {
                    this.createMessage('success', 'login succeed !');
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/application/dashboard']);
                },
                error: (error) => {
                    this.createMessage('error', error.error.message);
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                }
            }
        );
    }

    createMessage(type: string, message: any): void {
        this.message.create(type, ` ${message}`);
    }
}
