import { Router } from '@angular/router';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(private profileService: ProfileService , private jwtService: JwtHelperService , private router: Router ) { }


  email = null ;
  firstName = null ;
  companyName = null ;
  lastName = null ;
  isSubscriber = null ;
  autoRefresh = null ;

  roles = this.jwtService.decodeToken().data.roles ;

  error : any = null ;

  ngOnInit(): void {
    this.profileService.getProfileDetails().subscribe({
      next: (event: any) => {
          this.email = event.email ;
          this.lastName = event.lastName ;
          this.firstName = event.firstName ;
          this.companyName = event.companyName ;
          this.isSubscriber = event.isSubscriber ;
          this.autoRefresh = event.autoRefresh ;
      },
      error: err => {
      },
      complete: () => {
      }
    })

  }


  saveProfile(){
    this.error = null ;
    let data = {
      email : this.email,
      firstName : this.firstName,
      companyName : this.companyName,
      lastName : this.lastName ,
      isSubscriber : this.isSubscriber ,
      autoRefresh : this.autoRefresh ,
    };
    this.profileService.saveProfile(data).subscribe({
      next: (event: any) => {
          this.router.navigate(['/application/user/profile']);
        },
      error: err => {
        this.error = err.error;
      },
      complete: () => {
      }
    })
  }

}
