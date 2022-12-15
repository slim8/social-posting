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
    isErrorUser = false;
    isErrorPassword = false;
    isError = false;
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
        this.isErrorPassword = false;
        this.isErrorUser = false;
        this.isError = false;
        this.service.login(this.credentials).subscribe(
            {
                next: (response: any) => {
                    const message = $localize`:@@loginSucceed:Login succeed !`;
                    this.createMessage('success', message);
                    localStorage.setItem('fullName', response.fullName);
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/application/dashboard']);
                },
                error: (error) => {
                    this.isLoading = false;
                    error.error.message==undefined? this.isError = true:this.isError = false;
                    error.error.message=="User does not exist"? this.isErrorUser = true:this.isErrorUser = false;
                    error.error.message=="Password mismatch"? this.isErrorPassword = true:this.isErrorPassword = false;

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
