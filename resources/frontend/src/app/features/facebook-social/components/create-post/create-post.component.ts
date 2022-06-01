import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacebookSocialService } from '../../services/facebook-social.service';
import { Router } from '@angular/router';

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
    selectedValue = []
    isliked:boolean = false
    urlLinks: number[] = [];
    urlLinksIndex: number = 0;
    tags: string[] = [];
    inputVisible = false;
    inputValue = '';
    @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
    tabId1: any = 'instagram-tab-title'
    tabId: any = 'images'
    message: string = "";
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string; pagePictureUrl: string }> = [];
    size: NzSelectSizeType = 'large';
    tagValue = [];
    selectedFile: any = [];

    constructor(private router: Router, private shared: SharedModule, private facebookSocialService: FacebookSocialService, private messageService: NzMessageService, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.getPages();
        document.addEventListener("click", this.resetPostView);
    }

    resetPostView(e:any)  {
        let instaPost = document.getElementById("instagramPost") as HTMLElement;
        let tagPerson = document.getElementById("tagPerson") as HTMLElement;
        let input = document.getElementsByClassName('m-input-tag')[0] as HTMLElement;
        let tagOption = document.getElementsByClassName('tag-option');
        if(!e.path.includes(instaPost) && !e.path.includes(tagPerson) && !e.path.includes(tagOption)) {
            input.classList.remove("is-shown");
            instaPost.setAttribute("style","filter: none;");
        }
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
        let successDialog = document.getElementById('successDialog')
        let spinning = document.getElementsByClassName('m-loading-spin')[0]
        const formData: FormData = new FormData();

        this.tagValue.forEach((accountId: any) => {
            formData.append('accountIds[]', accountId);
        });

        if (this.tags.length > 0) {
            this.tags.forEach((tag: any) => {
                formData.append('tags[]', tag);
            });
        }

        if (this.selectedFile.length > 0) {
            this.selectedFile.forEach((file: any) => {
                formData.append('sources[]', file.originFileObj);
            });
        }

        // if (this.selectedFile.length > 0) {
        //     this.selectedFile.forEach((file: any) => {
        //         formData.append('images[]', file.originFileObj);
        //     });
        // }

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
                    err.error.errors.forEach((error: any) => {
                        this.shared.createMessage('error', error);
                    })
                    loadingScreen.classList.remove('m-loading-screen-active');
                    spinning.classList.remove('show');
                    btnSubmit?.classList.remove('m-btn-submit');
                },
                complete: () => {
                    this.selectedFile = [];
                    this.message = '';
                    this.tagValue = [];

                    loadingScreen.classList.remove('m-loading-screen-active');
                    spinning.classList.remove('show');
                    btnSubmit?.classList.remove('m-btn-submit');
                    successDialog?.classList.remove('is-hidden');
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
        let instagramPost = document.getElementById('instagramPost') as HTMLImageElement;
        // let facebookPost = document.getElementById('fp') as HTMLImageElement;
        // console.log(facebookPost);
        if(event.type == 'success') {
            this.selectedFile = event.fileList
            this.fileList.forEach((file : any, index) => {
                instagramPost.src = event.fileList[index].response.files.url;
            })
        }
    }

    handleClose(removedTag: {}): void {
        this.tags = this.tags.filter(tag => tag !== removedTag);
    }

    sliceTagName(tag: string): string {
        const isLongTag = tag.length > 20;
        return isLongTag ? `${tag.slice(0, 20)}...` : tag;
    }

    showInput(): void {
        this.inputVisible = true;
        setTimeout(() => {
            this.inputElement?.nativeElement.focus();
        }, 10);
    }

    handleInputConfirm(): void {
        if (this.inputValue) {
            this.tags = [...this.tags, this.inputValue];
        }
        this.inputValue = '';
        this.inputVisible = true;
    }

    tabChange1(id: any, event: any) {
        let list = [].slice.call(event.target.parentNode.children)
        list.forEach((elem: any) => {
            elem.classList.remove('is-active');
        })
        event.target.classList.add('is-active');
        this.tabId1 = id;
    }

    tabChange2(id: any, event: any) {
        let list = [].slice.call(event.target.parentNode.children)
        list.forEach((elem: any) => {
            elem.classList.remove('is-active');
        })
        event.target.classList.add('is-active');
        this.tabId = id;
    }

    like(e: any) {
        if (e.target.classList.contains('liked')) {
            e.target.classList.remove('liked')
        } else {
            e.target.classList.add('liked')
        }

    }

    addLink() {
        this.urlLinks.push(this.urlLinksIndex);
        this.urlLinksIndex++;
        console.log('add');
        console.log(this.urlLinks);
    }

    removeLink(index: number) {
        this.urlLinks.forEach((element, i) => {
            if (element == index) {
                this.urlLinks.splice(i, 1);
            }
        });
        console.log('remove');
        console.log(this.urlLinks);
    }

    liked(event : any) {
        event.target.classList.toggle('like')
        event.target.classList.toggle('is-liked')
        this.isliked = !this.isliked
    }

    resetSuccess() {
        let successDialog = document.getElementById('successDialog');
        successDialog?.classList.add('is-hidden')
    }

    test(urls : any) {
        
    }
    tag(event: any) {
        console.log(event)
        let post = document.getElementsByClassName('m-post-photo')[0] as HTMLElement;
        let input = document.getElementsByClassName('m-input-tag')[0] as HTMLElement;
        let posX = event.offsetX - 100;
        let posY = event.offsetY + 20;
        input?.classList.add('is-shown');
        input?.setAttribute("style", "top: "+ posY +"px;left: "+ posX +"px;");
        post?.setAttribute("style", "filter: brightness(0.5);")
    }
}
