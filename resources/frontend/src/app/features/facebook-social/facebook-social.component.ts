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
    accessToken:
      'EAAH6ob18mfkBAEmWL1pfuT2OSYzhWw1xoYadrccVyAJNzF9GBGPTfywP6YL4bkrTdnAWxensGym4LyocKy9CH2TfncZB9LRYxH3BmQpausNmZAsNv9vs8dcgo43oBN16XfdEuI2wVHk7CzrrISU7lLJaulRJ2N0OhP0zBuU6S0teIap5tTDd6Jg5Fw5HNupvjZBDgUZAvGTqBQDk5ZCH3H7cexxCODxvuZACpr0eNqZBAZDZD',
    id: '4832284733517871',
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
