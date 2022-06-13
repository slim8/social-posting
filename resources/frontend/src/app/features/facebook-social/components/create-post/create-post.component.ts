import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacebookSocialService } from '../../services/facebook-social.service';
import { ActivatedRoute, Router } from '@angular/router';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        console.log('image')
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
export class CreatePostComponent implements OnInit, OnChanges {
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
    bool: boolean = false;
    imageWidth = 0;
    imageHeight = 0;
    mentionIndex = 0;
    mentions: any = [];
    selectedValue = [];
    isliked: boolean = false;
    urlLinks: any = [];
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
        private router: Router,
        private shared: SharedModule,
        private facebookSocialService: FacebookSocialService,
        private messageService: NzMessageService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private elRef: ElementRef
    ) { }

    ngOnInit(): void {
        this.getPages();
        document.addEventListener('click', this.resetPostView);

        const mentioned = document.querySelector('.mentioned');

        mentioned?.addEventListener('click', this.edit);
        this.postId = this.activatedRoute.snapshot.params['id'];
        if (this.postId) {
            if (this.postdata.post.status === 'PUBLISH') {
                this.prepareform()
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("test");
        this.elRef.nativeElement.querySelector('.m-image').addEventListener('click', this.tag);
    }

    resetPostView(e: any) {
        let instaPost = document.getElementById('instagramPost') as HTMLElement;
        let tagPerson = document.getElementById('tagPerson') as HTMLElement;
        let input = document.getElementsByClassName(
            'm-input-tag'
        )[0] as HTMLElement;
        let tagOption = document.getElementsByClassName('tag-option');
        let tooltip = document.getElementById('tooltip') as HTMLElement;
        if (
            !e.path?.includes(instaPost) &&
            !e.path?.includes(tagPerson) &&
            !e.path?.includes(tagOption) &&
            !e.path?.includes(tooltip)
        ) {
            input?.classList.remove('is-shown');
            tooltip?.classList.remove('is-shown');
            instaPost?.setAttribute('style', 'filter: none;');
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
                formData.append('images[]', url);
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
                    console.log(err);
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

    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file['preview']) {
            file['preview'] = await getBase64(file.originFileObj!);
        }

        this.previewImage = file.url || file['preview'];
        this.previewVisible = true;
    };

    handleChange(event: any): void {
        let instagramPost = document.getElementById(
            'instagramPost'
        ) as HTMLImageElement;
        // let facebookPost = document.getElementById('fp') as HTMLImageElement;
        // console.log(facebookPost);
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
        this.urlLinks.push(this.urlLinks[this.urlLinksIndex]);
        this.urlLinksIndex++;
    }

    removeLink(index: number) {
        this.urlLinks.forEach((element: any, i: any) => {
            if (element == index) {
                this.urlLinks.splice(i, 1);
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

    tag(event: any) {
        this.imageHeight = event.path[0].clientHeight;
        this.imageWidth = event.path[0].clientWidth;
        this.inputValue2 = '@';
        let post = document.getElementsByClassName(
            'm-post-photo'
        )[0] as HTMLElement;
        let input = document.getElementsByClassName(
            'm-input-tag'
        )[0] as HTMLElement;
        let tooltip = document.getElementById('tooltip') as HTMLElement;
        this.posX = event.offsetX;
        this.posY = event.offsetY + 20;

        input?.classList.add('is-shown');
        tooltip?.classList.add('is-shown');
        tooltip?.setAttribute(
            'style',
            'top: ' + this.posY + 'px;left: ' + this.posX + 'px;'
        );
        post?.setAttribute('style', 'filter: brightness(0.5);');
        input.focus();
    }

    onChange(value: string): void {
        console.log(value);
    }

    onSelect(): void {
        let tooltip = document.createElement('div');
        let mentioned = document.querySelector('.mentioned');
        tooltip.setAttribute('data-index', this.mentionIndex.toString());
        tooltip.setAttribute('class', 'mentioned');
        let close = document.createElement('div');
        let imagetop = this.posY;
        let imageleft = this.posX;
        let mention = {
            username: '',
            x: 0,
            y: 0,
        };

        mention.username = this.inputValue2;
        mention.x = Math.round((this.posX / this.imageWidth) * 100) / 100;
        mention.y = Math.round((this.posY / this.imageHeight) * 100) / 100;
        this.mentions.push(mention);
        console.log(this.mentions);

        mentioned?.addEventListener('click', this.edit);

        close.classList.add('m-close');
        close.innerHTML = 'x';
        close?.setAttribute('style', 'padding:0 4px 0 10px;');
        tooltip.innerHTML = this.inputValue2;
        document.getElementById('postView')?.appendChild(tooltip);
        tooltip.appendChild(close);
        tooltip?.setAttribute(
            'style',
            'top: ' +
            this.posY +
            'px;left: ' +
            this.posX +
            'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
        );

        let tooltipwidth = tooltip.offsetWidth;
        let tooltipheight = tooltip.offsetHeight;

        //check left + bottom offset
        if (
            this.posX - tooltipwidth / 2 < 0 &&
            this.posY + tooltipheight > this.imageHeight
        ) {
            imageleft += tooltipwidth / 2 - this.posX;
            imagetop -= imagetop - this.imageHeight + tooltipheight;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                imagetop +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check right + bottom offset
        else if (
            this.posX + tooltipwidth / 2 > this.imageWidth &&
            this.posY + tooltipheight > this.imageHeight
        ) {
            imageleft -= tooltipwidth / 2 + (this.posX - this.imageWidth);
            imagetop -= imagetop - this.imageHeight + tooltipheight;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                imagetop +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check left offset
        else if (this.posX - tooltipwidth / 2 < 0) {
            imageleft += tooltipwidth / 2 - this.posX;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                this.posY +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check bottom offset
        else if (this.posY + tooltipheight > this.imageHeight) {
            imagetop -= imagetop - this.imageHeight + tooltipheight;
            tooltip?.setAttribute(
                'style',
                'top: ' +
                imagetop +
                'px;left: ' +
                this.posX +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }
        //check right offset
        else if (this.posX + tooltipwidth / 2 > this.imageWidth) {
            imageleft -= tooltipwidth / 2 + (this.posX - this.imageWidth);
            tooltip?.setAttribute(
                'style',
                'top: ' +
                this.posY +
                'px;left: ' +
                imageleft +
                'px;display: inline-flex;user-select: none;background: #000;border-radius: 6px;bottom: 135%;font-size: 12px;color: #fff;width: fit-content;height: 19px;line-height:10px;opacity: 0.3;padding: 4px 4px;position: absolute;text-align: center;transform: translateX(-50%);transition: 0.2s all;'
            );
        }

        this.mentionIndex++;
    }

    edit() {
        alert('hello');
    }

    viewMentions() {
        console.log('view mentions');
        this.bool = !this.bool;
        let mentions = Array.from(document.getElementsByClassName('mentioned'));
        console.log(mentions);
        mentions.forEach((element: any) => {
            if (this.bool) {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.display = 'none!important';
                }, 300);
            }
            if (!this.bool) {
                element.style.display = 'block!important';
                element.style.opacity = '0.3';
            }
        });
    }

    test() {
        console.log(this.url1);
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

    addimg() {
        // <img (dblclick)="tag($event)"  src="https://static.remove.bg/remove-bg-web/669d7b10b2296142983fac5a5243789bd1838d00/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg" alt="image #2">
        let carousel = document.getElementById('data-slides');
        let li = document.createElement('li');
        li.classList.add('m-slide');
        let img = document.createElement('img');
        img.classList.add('m-image');
        img.setAttribute('src', 'https://static.remove.bg/remove-bg-web/669d7b10b2296142983fac5a5243789bd1838d00/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg');
        img.setAttribute("style", "width: 360px;display: block;height: 100%;object-fit: cover;object-position: center;");
        li.appendChild(img);
        carousel?.appendChild(li);
    }

}
