import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  constructor(private profileService: ProfileService , private jwtService: JwtHelperService) { }

  profile:any = null;

  ngOnInit(): void {

    this.profileService.getProfileDetails(this.jwtService.decodeToken().data.id).subscribe({
      next: (event: any) => {
          console.log('event' , event);  
          this.profile = event ;  
      },
      error: err => {
        console.log('err' , err);
      },
      complete: () => {
        console.log('complete');
      }
    })
  }

}
