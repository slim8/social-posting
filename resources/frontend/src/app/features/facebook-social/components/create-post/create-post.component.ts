import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FacebookSocialService } from '../../services/facebook-social.service';


@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
    validateForm!: FormGroup;
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string }> = [];
    size: NzSelectSizeType = 'default';
    singleValue = 'a10';
    // multipleValue = ['a10', 'c12'];
    tagValue = [];
    urlLinks : number [] = [];
    urlLinksIndex: number = 0;

    constructor(private facebookSocialService: FacebookSocialService, private message: NzMessageService,private fb: FormBuilder) { }

    ngOnInit(): void {
        this.getPages();
        this.validateForm = this.fb.group({
            datePicker: [null],
            datePickerTime: [null],
            monthPicker: [null],
            rangePicker: [[]],
            rangePickerTime: [[]],
            timePicker: [null]
          });
    }

    getPages() {
        this.facebookSocialService.getCurrentApprovedFBPages().subscribe(
            (success: any) => {
                this.listOfPages = success.pages;
            },
            (error) => {
                this.createMessage('error', error.error.message);
            }
        );
    }

    createMessage(type: string, message: any): void {
        this.message.create(type, ` ${message}`);
    }

    addLink() {
        this.urlLinks.push(this.urlLinksIndex);
        this.urlLinksIndex ++;
        console.log('add');
        console.log(this.urlLinks);
    }

    removeLink(index: number) {
        this.urlLinks.forEach((element, i ) => {
            if(element == index) {
                this.urlLinks.splice(i,1);
            }
        });
        console.log('remove');
        console.log(this.urlLinks);
    }

    test() {
        console.log(this.validateForm.value);
    }

}
