import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  constructor(private profileService: ProfileService) { }

  profile:any = null;

  ngOnInit(): void {
    this.profileService.getProfileDetails(2).subscribe({
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
