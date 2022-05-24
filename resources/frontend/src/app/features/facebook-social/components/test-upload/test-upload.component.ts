import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { TestService } from '../../services/test.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

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
    selectedFile: any = [];
    uploading:boolean = false;

    constructor(private fb: FormBuilder, private msg: NzMessageService, private ts: TestService, private http: HttpClient) { }

    ngOnInit(): void {
    }

    submitForm() {
        const formData: FormData = new FormData();
        this.selectedFile.forEach((element : any) => {
            formData.append('sources[]', element.originFileObj);
        });
        formData.append('message', 'This message is a test message with multiple images on multiples pages');
        formData.append('accountIds[]', '4');

        this.http.post(sharedConstants.API_ENDPOINT+'/send-post', formData , {
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
        }, error => {
            console.log(error)
        });
    }

    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file['preview']) {
            file['preview'] = await getBase64(file.originFileObj!);
        }

        this.previewImage = file.url || file['preview'];
        this.previewVisible = true;
    };

    handleChange(event: any): void {
        this.selectedFile = event.fileList;
        console.log(this.selectedFile);
    }    
}
