import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'ngx-facebook';
import { FacebookSocialService } from './services/facebook-social.service';

@Component({
  selector: 'app-facebook-social',
  templateUrl: './facebook-social.component.html',
  styleUrls: ['./facebook-social.component.scss'],
})
export class FacebookSocialComponent implements OnInit {
  private formData: FormData = new FormData();
  private user = {
    accessToken: 'EAAHVOmc7RxYBAMS9WZBPFtsRSW0jTjeGTOMGLi9qgSsBZC8XnUnjlEElDZClFh4iaIJJNRD555OpMUcQpWLCSFGWOhanJPrbRQrLhklrZBZAJc9isvGcWKFY0wg2bQRSr4BUIoKbzcgaohIx0yE15QzeZCaN2Hljz5jZB0MZA2cabvayLRbCoZCo9ZCvHpsk98LCvWOtwjloJkhwZDZD',
    id: '557047552449017',
    pages: [],
  };
  constructor(private service: FacebookSocialService) {}

  ngOnInit(): void {
    this.service.getLoginStatus();
  }

  loginWithFacebook() {
    this.service
      .loginWithFacebook()
      .then((res: LoginResponse) => {
        this.user = {
          ...this.user,
          accessToken: res.authResponse.accessToken,
          id: res.authResponse.userID,
        };

        console.log(' user => ', this.user);
      })
      .catch(() => console.error('error'));
  }

  getCurrentFBPages() {
    this.service.getCurrentFBPages(this.user).subscribe((response: any) => {
      console.log('response => ', response.data);

      this.user = {
        ...this.user,
        pages: response.data,
      };
    });
  }

  postTextToPages() {
    this.user.pages.forEach((page) => {
      this.service.postTextToPage(page).then((response) => {
        console.log('post Result => ' + response);
      });
    });
  }

  postImageToPages() {
    this.user.pages.forEach((page) => {
      this.service.postPublicImageToPage(page).then((response) => {
        console.log('post Result => ' + response);
      });
    });
  }

  postSourceImageToPages() {
    this.user.pages.forEach((page: any) => {
      this.service
        .postSourceImageToPage(page, this.formData)
        .subscribe((response) => {
          console.log('post Result => ' + response);
        });
    });
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      this.formData.append('source', file);
      // this.formData.append('access_token', this.user.accessToken);
      this.formData.append(
        'message',
        'Upload Multipart File Success ! From Ali Werghemmi'
      );

      console.log(file);
    }
  }
}
