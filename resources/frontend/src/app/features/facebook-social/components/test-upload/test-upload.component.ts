import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { TestService } from '../../services/test.service';


@Component({
    selector: 'app-test-upload',
    templateUrl: './test-upload.component.html',
    styleUrls: ['./test-upload.component.scss']
})
export class TestUploadComponent implements OnInit {
    validateForm!: FormGroup;
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    sources: object[] = [];

    constructor(private fb: FormBuilder, private msg: NzMessageService, private ts: TestService, private http: HttpClient) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            uploadFile: []
        });
    }

    submitForm() {
        // console.log(this.sources);
        let credentials = {
            accountIds: ["4"],
            message: 'This message is a test message with multiple images on multiples pages',
            sources: this.sources
        };

        this.http.post('http://posting.local/api/send-post', credentials).subscribe(
            (success => {
                console.log('success')
            }) 
        );
        // this.handleChange(info: NzUploadChangeParam);
        // console.log(this.validateForm.value);
    }

    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file['preview']) {
            var reader = new FileReader();
            file['preview'] = await reader.readAsDataURL(file.originFileObj!);
        }
        this.previewImage = file.url || file['preview'];
        this.previewVisible = true;
        console.log(this.previewImage);
    };

    handleChange(info: NzUploadChangeParam): void {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
            this.sources = info.fileList;
        }
    }



}
