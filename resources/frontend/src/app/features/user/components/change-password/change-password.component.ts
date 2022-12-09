import { Router } from '@angular/router';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor( private profileService: ProfileService , private jwtService: JwtHelperService , private router: Router  ) { }

  currentPassword = null ;
  newPassword = null ;
  passwordConfirmation = null ;

  error : any = null ;

  showCurrentPassword : Boolean = false ;
  showNewPassword : Boolean = false ;
  showPasswordConfirmation : Boolean = false ;

  ngOnInit(): void {

  }

  showCurrentPasswordAction(){
    this.showCurrentPassword = !this.showCurrentPassword ;
  };

  showNewPasswordAction(){
    this.showNewPassword = !this.showNewPassword ;
  };

  showPasswordConfirmationAction(){
    this.showPasswordConfirmation = !this.showPasswordConfirmation ;
  };

  saveNewPassword(){
    this.error = null ;
    let data = {
      password : this.newPassword,
      passwordConfirmation : this.passwordConfirmation,
      currentPassword : this.currentPassword ,
    };
    this.profileService.saveNewPassword(data).subscribe({
      next: (event: any) => {
      },
      error: err => {

        this.error = err.error;
      },
      complete: () => {
        this.router.navigate(['/application/user/profile']);
      }
    })
  }

}
