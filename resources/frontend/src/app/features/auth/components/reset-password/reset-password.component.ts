import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgetPasswordService } from '../../services/forget-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  passwordVisible2: boolean = false;
  token: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private forgetPasswordService: ForgetPasswordService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  submit(): void {
    this.isLoading = true;
    const formData: FormData = new FormData();
    formData.append('token', this.token);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('passwordConfirmation', this.confirmPassword);

    this.forgetPasswordService.resetPassword(formData).subscribe({
      next: (event: any) => {

      },
      error: err => {
        this.createMessage('error', err.error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        let modal = document.querySelector('.m-success-modal');
        modal?.classList.add('open');
      }
    })
  }

  closeSuccessModal() {
    let modal = document.querySelector('.m-success-modal');
    modal?.classList.remove('open');
    setTimeout(()=>{
      this.router.navigate(['/auth/login']);
    },500)
  }

  createMessage(type: string, message: any): void {
    this.message.create(type, ` ${message}`);
  }

}
