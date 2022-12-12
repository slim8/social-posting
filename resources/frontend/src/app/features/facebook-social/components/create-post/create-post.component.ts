import { Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacebookSocialService } from '../../services/facebook-social.service';
import { ActivatedRoute } from '@angular/router';
import { PostModel } from 'src/app/models/Post.model';

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
    //refresh instagram component
    refresh: boolean = false;

    postdata: any = {
        post: {
            id: 41,
            message: "This is a test post for Oussema",
            url: "url",
            status: "PUBLISH",
            isScheduled: 0,
            publishedAt: "2022-06-07 08:10:19",
            deleted_at: null,
            created_at: "2022-06-07T08:03:19.000000Z",
            updated_at: "2022-06-07T08:10:19.000000Z",
            video_title: "",
            created_by: 2,
            post_media: [
                {
                    id: 58,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:03:19.000000Z",
                    updated_at: "2022-06-07T08:03:19.000000Z"
                },
                {
                    id: 59,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:03:19.000000Z",
                    updated_at: "2022-06-07T08:03:19.000000Z"
                },
                {
                    id: 60,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:03:35.000000Z",
                    updated_at: "2022-06-07T08:03:35.000000Z"
                },
                {
                    id: 61,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:03:35.000000Z",
                    updated_at: "2022-06-07T08:03:35.000000Z"
                },
                {
                    id: 62,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:03:44.000000Z",
                    updated_at: "2022-06-07T08:03:44.000000Z"
                },
                {
                    id: 63,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:03:44.000000Z",
                    updated_at: "2022-06-07T08:03:44.000000Z"
                },
                {
                    id: 64,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:08:04.000000Z",
                    updated_at: "2022-06-07T08:08:04.000000Z"
                },
                {
                    id: 65,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:08:04.000000Z",
                    updated_at: "2022-06-07T08:08:04.000000Z"
                },
                {
                    id: 66,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:10:07.000000Z",
                    updated_at: "2022-06-07T08:10:07.000000Z"
                },
                {
                    id: 67,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:10:07.000000Z",
                    updated_at: "2022-06-07T08:10:07.000000Z"
                },
                {
                    id: 68,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:10:19.000000Z",
                    updated_at: "2022-06-07T08:10:19.000000Z"
                },
                {
                    id: 69,
                    url: "https://thepressfree.com/wp-content/uploads/2021/06/Google_Reuters_F-1-800x445.jpg",
                    type: "image",
                    post_id: 41,
                    created_at: "2022-06-07T08:10:19.000000Z",
                    updated_at: "2022-06-07T08:10:19.000000Z"
                }
            ],
            accounts: [
                {
                    id: 1
                },
                {
                    id: 1
                },
                {
                    id: 4
                },
                {
                    id: 4
                }
            ],
            tags: [
                {
                    name: "tag_two"
                },
                {
                    name: "tag_three"
                },
                {
                    name: "tag_two"
                },
                {
                    name: "tag_three"
                },
                {
                    name: "tag_two"
                },
                {
                    name: "tag_three"
                },
                {
                    name: "tag_two"
                },
                {
                    name: "tag_three"
                },
                {
                    name: "tag_two"
                },
                {
                    name: "tag_three"
                },
                {
                    name: "tag_two"
                },
                {
                    name: "tag_three"
                }
            ]
        },
        success: true
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


    isLoading = false;
    showDialog = false;
    submitForm(param: string) {
        const formData: FormData = new FormData();

        this.tagValue.forEach(accountId => {
            const post = new PostModel(this.message, this.tags, this.mentions, accountId, "this is video title");
            formData.append('posts[]', JSON.stringify(post));
        });

        this.tags.forEach(tag => {
            formData.append('tags[]', tag);
        });

        this.mentions.forEach((mention: string) => {
            formData.append('mention[]', mention);
        });

        this.urlLinks.forEach(url => {
            formData.append('images[]', url.url);
        });

        this.selectedFile.forEach((file: any) => {
            formData.append('sources[]', file.originFileObj);
        });

        formData.append('status', param);
        formData.append('message', this.message);

        if (formData) {
            this.facebookSocialService.postToSocialMedia(formData).subscribe({
                next: () => {
                    this.isLoading = true;
                },
                error: (err) => {
                    const array = (err.error.errors) ? err.error.errors : [err.error.message];
                    array.forEach((element: string) => {
                        this.shared.createMessage('error', element);
                    })
                    this.isLoading = false;
                },
                complete: () => {
                    this.selectedFile = [];
                    this.message = '';
                    this.tagValue = [];

                    this.isLoading = false;

                    if (param === 'PUBLISH') {
                        this.showDialog = false;
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
        this.refreshPreview();
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

    prepareform() {
        this.pushMedias();
        this.pushTags();
        this.message = this.postdata.post.message;
    }

    pushMedias() {
        this.postdata.post.post_media.forEach((el: any) => {
            const media: any = {
                url: el.url
            }
            this.fileList.push(media);
        })
    }

    pushTags() {
        this.postdata.post.tags.forEach((t: any) => {
            this.tags.push(t.name);
        })
    }

    refreshPreview() {
        // waiting for better solution
        this.refresh = true;
        setTimeout(() => {
            this.refresh = false;
        }, 0.1)
    }
}
