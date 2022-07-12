import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForgetPasswordService } from '../../services/forget-password.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  email: string = "";
  isLoading: boolean = false;

  constructor(
    private forgetPasswordService : ForgetPasswordService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    const formData: FormData = new FormData();
    formData.append('email', this.email);
    this.forgetPasswordService.forgetPassword(formData).subscribe({
      next: (event: any) => {

      },
      error: err => {
      },
      complete: () => {
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

}
