import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'ngx-facebook';
import { FacebookSocialService } from './services/facebook-social.service';
import {FormBuilder, FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-facebook-social',
  templateUrl: './facebook-social.component.html',
  styleUrls: ['./facebook-social.component.scss'],
})
export class FacebookSocialComponent implements OnInit {
  private formData: FormData = new FormData();
  private user = {
    accessToken: '',
    id: '557047552449017',
    pages: [],
  };

  isVisible = false;
  listpages :any;
  validateForm!: FormGroup;

  constructor(private service: FacebookSocialService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.service.getLoginStatus();
    this.validateForm = this.fb.group({
      myChoices: new FormArray([]),
    });
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

        this.service.manageFacebookPages("http://media-posting.local/api/get-facebook-pages",
          {
            "accessToken": "",
            "id": "1703848376633794"
          }).subscribe((response: any) => {
          console.log(this.listpages)
          this.listpages = response.pages;
          console.log(this.listpages);
          this.showModal();
        });

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

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  onSubmit() {
    if (this.validateForm.valid) {
      console.log(this.validateForm.value);

      console.log("this.listpages",this.listpages);

      let selectedobject = this.listpages.filter((item: any) => this.validateForm.value.myChoices.includes(item.pageId));

      this.service.manageFacebookPages("http://media-posting.local/api/facebook/save-pages",
        {
          "pages": selectedobject
        }).subscribe((response: any) => {
        console.log("saveFacebookPages")
        console.log(response)
      });

      this.validateForm = this.fb.group({
        myChoices: new FormArray([]),
      });
      this.isVisible = false;

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  onCheckChange(event:any) {
    const formArray: FormArray = this.validateForm.get('myChoices') as FormArray;
    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    }
  }

}
