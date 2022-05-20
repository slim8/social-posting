import { HttpClient, HttpEventType } from '@angular/common/http';
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
    selectedFile: any;

    constructor(private fb: FormBuilder, private msg: NzMessageService, private ts: TestService, private http: HttpClient) { }

    ngOnInit(): void {
        // this.validateForm = this.fb.group({
        //     uploadFile: []
        // });
    }

    submitForm() {
        const fd = new FormData();
        fd.append('accountIds', '["4"]');
        fd.append('message', 'This message is a test message with multiple images on multiples pages');
        fd.append('sources', this.selectedFile);
        fd.append('_method', 'PUT');
        console.log(fd);
        this.http.post('http://posting.local/api/send-post', fd, {
            reportProgress: true,
            observe: 'events'
        }).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                if (event.total) {
                    const total: number = event.total;
                    console.log('Upload Progress: ' + Math.round(event.loaded / total) * 100 + '%');
                }
            } else if (event.type === HttpEventType.Response) {
                console.log(event);
            }
        });

        // this.http.post('http://posting.local/api/send-post', credentials).subscribe(
        //     (success => {
        //         console.log('success')
        //     }) 
        // );

        // console.log(this.sources);
        // let credentials = {
        //     accountIds: ["4"],
        //     message: 'This message is a test message with multiple images on multiples pages',
        //     sources: this.sources
        // };

        // this.http.post('http://posting.local/api/send-post', credentials).subscribe(
        //     (success => {
        //         console.log('success')
        //     }) 
        // );
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

    handleChange(event: any): void {
        this.selectedFile = event.target.files[0];
        // console.log(this.selectedFile);
    }

}
