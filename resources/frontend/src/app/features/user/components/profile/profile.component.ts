import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  constructor(private profileService: ProfileService , private jwtService: JwtHelperService , private router: Router ) { }

  profile:any = null;

  ngOnInit(): void {

    this.profileService.getProfileDetails().subscribe({
      next: (event: any) => {  
          this.profile = event ;  
      },
      error: err => {
      },
      complete: () => {
      }
    })
  }

  toEditPage(){
    this.router.navigate(['/application/user/edit-profile']);
  }

}
