import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router"
interface success {
    message:String;
    token: String;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  credentials = {
    email: 'eve.holt@reqres.ifffn',
    password: 'cityslickacsssdqsd',
  };
  passwordVisible = false;
  password?: string;
  constructor(
    private service: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('token');
  }

  login() {
    this.service.login(this.credentials).subscribe(
      (success:any) => {
        this.createMessage('success', 'login succeed !');
        localStorage.setItem('token', success.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.createMessage('error', error.error.message);
      }
    );
  }

  createMessage(type: string, message: any): void {
    this.message.create(type, ` ${message}`);
  }
}
