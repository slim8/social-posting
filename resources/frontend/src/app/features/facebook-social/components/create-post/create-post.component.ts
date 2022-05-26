import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacebookSocialService } from '../../services/facebook-social.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
    message: string = "";
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string; pagePictureUrl: string }> = [];
    size: NzSelectSizeType = 'large';
    tagValue = [];
    selectedFile: any = [];

    constructor(private shared: SharedModule, private facebookSocialService: FacebookSocialService, private messageService: NzMessageService, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.getPages();
    }

    getPages() {
        this.facebookSocialService.getCurrentApprovedFBPages().subscribe(
            (success: any) => {
                this.listOfPages = success.pages;
            },
            (error) => {
                this.shared.createMessage('error', error.error.message);
            }
        );
    }

    submitForm() {
        let loadingScreen = document.getElementsByClassName('m-loading-screen')[0]
        let btnSubmit = document.getElementById('btn-submit')
        let spinning = document.getElementsByClassName('m-loading-spin')[0]

        const formData: FormData = new FormData();
        this.tagValue.forEach((accountId: any) => {
            formData.append('accountIds[]', accountId);
        });
        this.selectedFile.forEach((file: any) => {
            formData.append('sources[]', file.originFileObj);
        });
        formData.append('message', this.message);

        if (formData) {

            this.facebookSocialService.postToSocialMedia(formData).subscribe({
                next: event => {
                    loadingScreen.classList.add('m-loading-screen-active');
                    spinning.classList.add('show')
                    btnSubmit?.classList.add('m-btn-submit')

                    if (event.type === HttpEventType.UploadProgress) {
                        if (event.total) {
                            const total: number = event.total;
                            console.log('Upload Progress: ' + Math.round(event.loaded / total) * 100 + '%');
                        }
                    }
                },
                error: err => {
                    err.error.errors.forEach((error : any )=> {
                        this.shared.createMessage('error', error);
                    })
                    loadingScreen.classList.remove('m-loading-screen-active');
                    spinning.classList.remove('show')
                    btnSubmit?.classList.remove('m-btn-submit')
                },
                complete: () => {
                    loadingScreen.classList.remove('m-loading-screen-active');
                    spinning.classList.remove('show')
                    btnSubmit?.classList.remove('m-btn-submit')
                }
            });

        }
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
    }
}
