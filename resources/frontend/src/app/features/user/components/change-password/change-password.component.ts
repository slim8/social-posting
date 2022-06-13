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
    console.log('in');
    
    this.showPasswordConfirmation = !this.showPasswordConfirmation ;
  };

  saveNewPassword(){
    this.error = null ;
    console.log(this.currentPassword , this.newPassword , this.passwordConfirmation );
    let data = {
      password : this.newPassword,
      password_confirmation : this.passwordConfirmation, 
      id : this.jwtService.decodeToken().data.id , 
      currentPassword : this.currentPassword ,
    };
    this.profileService.saveNewPassword(data).subscribe({
      next: (event: any) => {
          console.log('event' , event);  
      },
      error: err => {
        console.log('err' , err , err.error);
        this.error = err.error;
      },
      complete: () => {
        console.log('complete');
        this.router.navigate(['/home/user/profile']);
      }
    })
  }

}
