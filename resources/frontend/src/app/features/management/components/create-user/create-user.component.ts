import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  constructor(private router: Router , private userService: UserService) { }

  email = null ;
  firstName = null ;
  lastName = null ;
  isSubscriber = false ;
  adress = null ;
  website = null ;
  error : any = null ;
  newPassword = Math.random().toString(36).slice(-8); ;


  showNewPassword : Boolean = false ;

  ngOnInit(): void {
    
  }

  showNewPasswordAction(){
    this.showNewPassword = !this.showNewPassword ;
  };

  saveProfile(){
    this.error = null ;
    let data = {
      email : this.email,
      firstName : this.firstName, 
      lastName : this.lastName , 
      isSubscriber : this.isSubscriber ,
      adress : this.adress ,
      website : this.website ,
      password : this.newPassword ,
    };

    this.userService.createUser(data).subscribe({
      next: (event: any) => {
          this.router.navigate(['/home/management/users-list']);
        },
      error: err => {
        this.error = err.error;
      },
      complete: () => {
      }
    })
  }

}
