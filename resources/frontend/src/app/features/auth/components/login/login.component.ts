import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {email: 'eve.holt@reqres.ifffn', password: 'cityslickacsssdqsd'};
  passwordVisible = false;
  password?: string;
  constructor(private service: AuthService, private message: NzMessageService) { }

  ngOnInit(): void {
  }


  login() {
    this.service.login( this.credentials).subscribe(
      ( success ) => {
        this.createMessage('success', 'login succeed !')
        console.log(success);
      },
      ( error: any ) => {
        this.createMessage('error', error.message);
      }
    )
  }


  createMessage(type: string, message: any ): void {
    this.message.create(type, ` ${message}`);
  }
}
