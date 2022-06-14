import { Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacebookSocialService } from '../../services/facebook-social.service';
import { ActivatedRoute } from '@angular/router';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
    postdata = {
        "post": {
            "id": 41,
            "message": "This is a test post for Oussema",
            "url": "url",
            "status": "PUBLISH",
            "isScheduled": 0,
            "publishedAt": "2022-06-07 08:10:19",
            "deleted_at": null,
            "created_at": "2022-06-07T08:03:19.000000Z",
            "updated_at": "2022-06-07T08:10:19.000000Z",
            "video_title": "",
            "created_by": 2,
            "post_media": [
                {
                    "id": 58,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:03:19.000000Z",
                    "updated_at": "2022-06-07T08:03:19.000000Z"
                },
                {
                    "id": 59,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:03:19.000000Z",
                    "updated_at": "2022-06-07T08:03:19.000000Z"
                },
                {
                    "id": 60,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:03:35.000000Z",
                    "updated_at": "2022-06-07T08:03:35.000000Z"
                },
                {
                    "id": 61,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:03:35.000000Z",
                    "updated_at": "2022-06-07T08:03:35.000000Z"
                },
                {
                    "id": 62,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:03:44.000000Z",
                    "updated_at": "2022-06-07T08:03:44.000000Z"
                },
                {
                    "id": 63,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:03:44.000000Z",
                    "updated_at": "2022-06-07T08:03:44.000000Z"
                },
                {
                    "id": 64,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:08:04.000000Z",
                    "updated_at": "2022-06-07T08:08:04.000000Z"
                },
                {
                    "id": 65,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:08:04.000000Z",
                    "updated_at": "2022-06-07T08:08:04.000000Z"
                },
                {
                    "id": 66,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:10:07.000000Z",
                    "updated_at": "2022-06-07T08:10:07.000000Z"
                },
                {
                    "id": 67,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:10:07.000000Z",
                    "updated_at": "2022-06-07T08:10:07.000000Z"
                },
                {
                    "id": 68,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:10:19.000000Z",
                    "updated_at": "2022-06-07T08:10:19.000000Z"
                },
                {
                    "id": 69,
                    "url": "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    "type": "image",
                    "post_id": 41,
                    "created_at": "2022-06-07T08:10:19.000000Z",
                    "updated_at": "2022-06-07T08:10:19.000000Z"
                }
            ],
            "accounts": [
                {
                    "id": 1
                },
                {
                    "id": 1
                },
                {
                    "id": 4
                },
                {
                    "id": 4
                }
            ],
            "tags": [
                {
                    "name": "tag_two"
                },
                {
                    "name": "tag_three"
                },
                {
                    "name": "tag_two"
                },
                {
                    "name": "tag_three"
                },
                {
                    "name": "tag_two"
                },
                {
                    "name": "tag_three"
                },
                {
                    "name": "tag_two"
                },
                {
                    "name": "tag_three"
                },
                {
                    "name": "tag_two"
                },
                {
                    "name": "tag_three"
                },
                {
                    "name": "tag_two"
                },
                {
                    "name": "tag_three"
                }
            ]
        },
        "success": true
    };
    url1 = '';
    urlImages: string[] = [];
    bool: boolean = false;
    imageWidth = 0;
    imageHeight = 0;
    mentionIndex = 0;
    mentions: any = [];
    selectedValue = [];
    isliked: boolean = false;
    @Input() urlLinks: any[] = [{ url: "" }];
    urlLinksIndex = 0;
    tags: string[] = [];
    inputVisible = false;
    inputValue = '';
    @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
    tabId1: any = 'instagram-tab-title';
    tabId: any = 'images';
    message: string = '';
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string; pagePictureUrl: string }> =
        [];
    size: NzSelectSizeType = 'large';
    tagValue: any[] = [];
    selectedFile: any = [];
    inputValue2 = '@';
    suggestions = [
        'Ali_werghemmi',
        'z.i.e.d.m',
        'oussemakassis',
        'amalrk',
        '中文',
        'にほんご',
    ];
    posX = 0;
    posY = 0;
    postId = null;

    constructor(
        private shared: SharedModule,
        private facebookSocialService: FacebookSocialService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.getPages();
        // setTimeout(() => {
        //     this.urlLinks = [{ url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" },
        //     { url: "https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q=" },
        //     { url: "https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q=" }]
        // }, 5000);
        const mentioned = document.querySelector('.mentioned');

        mentioned?.addEventListener('click', this.edit);
        this.postId = this.activatedRoute.snapshot.params['id'];
        if (this.postId) {
            if (this.postdata.post.status === 'PUBLISH') {
                this.prepareform()
            }
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

    submitForm(param: string) {
        let loadingScreen = document.getElementsByClassName('m-loading-screen')[0];
        let btnSubmit = document.getElementById('btn-submit');
        let successDialog = document.getElementById('successDialog');
        let spinning = document.getElementsByClassName('m-loading-spin')[0];
        const formData: FormData = new FormData();

        this.tagValue.forEach((accountId: any) => {
            formData.append('accountIds[]', accountId);
        });

        if (this.tags.length > 0) {
            this.tags.forEach((tag: any) => {
                formData.append('tags[]', tag);
            });
        }

        if (this.mentions.length > 0) {
            this.mentions.forEach((mention: any) => {
                formData.append('mention[]', mention);
            });
        }

        if (this.urlLinks.length > 0) {
            this.urlLinks.forEach((url: any) => {
                formData.append('images[]', url.url);
                // url . url because the Url is an array and contain url Object (to avoid bug of bloc input with ngModel of Array)
            });
        }

        if (this.selectedFile.length > 0) {
            this.selectedFile.forEach((file: any) => {
                formData.append('sources[]', file.originFileObj);
            });
        }

        formData.append('status', param);
        formData.append('message', this.message);

        if (formData) {
            this.facebookSocialService.postToSocialMedia(formData).subscribe({
                next: (event) => {
                    loadingScreen.classList.add('m-loading-screen-active');
                    spinning.classList.add('show');
                    btnSubmit?.classList.add('m-btn-submit');
                },
                error: (err) => {
                    if (err.error.errors) {
                        err.error.errors.forEach((error: any) => {
                            this.shared.createMessage('error', error);
                        });
                    }
                    else {
                        this.shared.createMessage('error', err.error.message);
                    }
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

                    if (param == 'PUBLISH') {
                        successDialog?.classList.remove('is-hidden');
                    } else {
                        this.shared.createMessage('success', 'saved to drafts!');
                    }

                },
            });
        }
    }

    //Images preview from upload file 
    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file['preview']) {
            file['preview'] = await getBase64(file.originFileObj!);
        }

        this.previewImage = file.url || file['preview'];
        this.previewVisible = true;
    };

    //upload files changes
    handleChange(event: any): void {
        let instagramPost = document.getElementById(
            'instagramPost'
        ) as HTMLImageElement;
        // let facebookPost = document.getElementById('fp') as HTMLImageElement;
        if (event.type == 'success') {
            this.selectedFile = event.fileList;
            this.fileList.forEach((file: any, index) => {
                instagramPost.src = event.fileList[index].response.files.url;
            });
        }
    }

    handleClose(removedTag: {}): void {
        this.tags = this.tags.filter((tag) => tag !== removedTag);
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
        let list = [].slice.call(event.target.parentNode.children);
        list.forEach((elem: any) => {
            elem.classList.remove('is-active');
        });
        event.target.classList.add('is-active');
        this.tabId1 = id;
    }

    tabChange2(id: any, event: any) {
        let list = [].slice.call(event.target.parentNode.children);
        list.forEach((elem: any) => {
            elem.classList.remove('is-active');
        });
        event.target.classList.add('is-active');
        this.tabId = id;
    }

    like(e: any) {
        if (e.target.classList.contains('liked')) {
            e.target.classList.remove('liked');
        } else {
            e.target.classList.add('liked');
        }
    }

    addLink() {
        this.urlLinksIndex++;
        this.urlLinks[this.urlLinksIndex] = { url: '' };
    }

    removeLink(index: number) {
        this.urlLinks.forEach((element: any, i: any) => {
            if (element == index) {
                this.urlLinks.splice(i, 1);
                this.urlLinksIndex--;
            }
        });
    }

    liked(event: any) {
        event.target.classList.toggle('like');
        event.target.classList.toggle('is-liked');
        this.isliked = !this.isliked;
    }

    resetSuccess() {
        let successDialog = document.getElementById('successDialog');
        successDialog?.classList.add('is-hidden');
    }

    edit() {
        alert('hello');
    }

    test() {

    }

    prepareform() {
        this.postdata.post.post_media.forEach((el: any) => {
            let media: any = {
                url: el.url,
            }
            this.fileList.push(media);
        })

        this.postdata.post.tags.forEach((t: any) => {
            this.tags.push(t.name);
        })
        this.message = this.postdata.post.message;
    }

    changeUrl() {

    }


}
