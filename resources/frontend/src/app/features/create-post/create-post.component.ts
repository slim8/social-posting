import { NzModalService } from 'ng-zorro-antd/modal';
import { PostService } from './../../shared/services/post.service';
import { Component, Input, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { FacebookSocialService } from '../facebook-social/services/facebook-social.service';
import {importFileandPreview , generateVideoThumbnails} from './index';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
export class CreatePostComponent implements OnInit  {
    //upload file apiURL
    uploadFileAPIURL = sharedConstants.API_ENDPOINT + "uploadfile";

    //refresh instagram component
    refresh: boolean = false;
    uploadImageActive: boolean = false;

    //open app previews
    facebookPreview: boolean = false;
    instagramPreview: boolean = true;

    //available media test
    availableVideos: boolean = false;
    availableImages: boolean = false;

    url1 = '';
    urlImages: string[] = [];
    bool: boolean = false;
    imageWidth = 0;
    imageHeight = 0;
    mentionIndex = 0;
    mentions: any = [];
    selectedValue = [];
    isliked: boolean = false;
    mediaId: number = 0;
    @Input() urlLinks: any[] = [{ id: 0, url: "", type:"" }];
    urlLinksIndex = 0;
    tags: string[] = [];
    instaTags: string[] = [];
    fbTags: string[] = [];
    inputVisible = false;
    inputValue = '';
    inputValueInsta = '';
    inputValueFb = '';
    @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
    tabId1: any = 'instagram-tab-title';
    tabId: any = 'images';
    message: string = '';
    facebookMessage: string = '';
    instagramMessage: string = '';
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string; provider: string; pagePictureUrl: string }> =[];
    size: NzSelectSizeType = 'large';
    accountsValue: any[] = [];
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
    showUploadVideo = false;
    selectedVideo :any = null;
    selectedThumbnail = {
        imgB64 : '' ,
        time : 0
    };
    listThumbnail : { imgB64 : any , time : any }[] = [];
    leadThumbnail : Boolean = false;
    currentTimePosition = -10;
    duration = 10;

    videoCounter = 0;
    videoList: {id : number ,file : File }[] = [];
    selectedThumbnailList : {id : number , imgB64 : string , time : number}[] = [];


    showAlbum : boolean = false;

    constructor(
        private shared: SharedModule,
        private facebookSocialService: FacebookSocialService,
        private activatedRoute: ActivatedRoute,
        private postService: PostService ,
        private modal: NzModalService,
        private notification: NzNotificationService
    ) { }

    ngOnInit(): void {
        this.getPages('mixed');
        const mentioned = document.querySelector('.mentioned');

        mentioned?.addEventListener('click', this.edit);
        this.postId = this.activatedRoute.snapshot.params['id'];
        // if (this.postId) {
        //     if (this.postdata.post.status === 'PUBLISH') {
        //         this.prepareform()
        //     }
        // }
    }

    getPages(param: string) {
      this.listOfPages=[];
      this.accountsValue = [];
      this.facebookSocialService.getCurrentApprovedFBPages().subscribe({
        next: (event: any) => {
          this.listOfPages = new Array();
          event.pages.forEach((page: any) => {
            if(param == 'mixed') {
              if (page.isConnected == true) {
                this.listOfPages.push(page);
              }
            }
            else if (param == 'instagram') {
              if (page.isConnected == true && page.provider == 'instagram') {
                this.listOfPages.push(page);
              }
            }
          })
        },
        error: err => {
          this.shared.createMessage('error', err.error.message);
        },
        complete: () => {

        }
      });
    }

    submitForm(param: string) {
        // TODO:: for video upload

        // this.postService.uploadFile(this.selectedVideo).subscribe({
        //     next: (response) => {
        //         console.log(response.files , this.selectedThumbnail , this.selectedVideo);
        //     },
        //     error: (err) => {
        //     },
        //     complete: () => {
        //     },
        // }) ;

        let loadingScreen = document.getElementsByClassName('m-loading-screen')[0];
        let btnSubmit = document.getElementById('btn-submit');
        let iconSave = document.querySelector('.m-button-icon-save');
        let iconPublish = document.querySelector('.m-button-icon-publish');
        let spinningDraft = document.getElementsByClassName('m-loading-spin')[0];
        let spinningPublish = document.getElementsByClassName('m-loading-spin')[1];
        // m-button-icon-save
        const formData: FormData = new FormData();
        let post: any = {
            message: "",
            hashtags: [],
            mentions: [],
            accountId: "",
            videoTitle: ""
        }
        this.accountsValue.forEach((accountId: any) => {
            let arr = accountId.split("|");
            let id = arr[0];
            if (accountId.includes('facebook')) {
                post.message = this.facebookMessage;
                post.hashtags = this.fbTags;
                post.mentions = this.mentions;
                post.accountId = id;
                post.videoTitle = "";
            } else if (accountId.includes('instagram')) {
                post.message = this.instagramMessage;
                post.hashtags = this.instaTags;
                post.mentions = this.mentions;
                post.accountId = id;
                post.videoTitle = "";
            }
            formData.append('posts[]', JSON.stringify(post));
        });

        // if (this.tags.length > 0) {
        //     this.tags.forEach((tag: any) => {
        //         formData.append('tags[]', tag);
        //     });
        // }

        // if (this.mentions.length > 0) {
        //     this.mentions.forEach((mention: any) => {
        //         formData.append('mention[]', mention);
        //     });
        // }

        if (this.urlLinks.length > 0) {
          this.urlLinks.forEach((media: any) => {
              let videoObject: any = {
                url: "",
                seconde: "",
                thumbnail: ""
              }
              if(media.type == "image") {
                formData.append('images[]', media.url);
              } else if (media.type == "video") {
                videoObject.url = media.url;
                videoObject.seconde = 3;
                videoObject.thumbnail = "http://thisisaverytestmp.rf.gd/files/images/2YQ3yYkITqiIH6UPe4THHNUGheTYDBYhaSEL7VVn.jpg";
                formData.append('videos[]', JSON.stringify(videoObject));
              }

                // url . url because the Url is an array and contain url Object (to avoid bug of bloc input with ngModel of Array)
            });
        }

        // if (this.selectedFile.length > 0) {
        //     this.selectedFile.forEach((file: any) => {
        //         formData.append('sources[]', file.originFileObj);
        //     });
        // }

        formData.append('status', param);
        formData.append('message', this.message);

        if (formData) {
            this.facebookSocialService.postToSocialMedia(formData).subscribe({
                next: (event) => {
                    if (param == 'PUBLISH') {
                        iconPublish?.classList.add('hide');
                        iconPublish?.parentElement?.classList.add('wide');
                        spinningPublish.classList.add('show');
                    } else {
                        iconSave?.classList.add('hide');
                        iconSave?.parentElement?.classList.add('wide');
                        spinningDraft.classList.add('show');
                    }
                    loadingScreen.classList.add('m-loading-screen-active');
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
                    if (param == 'PUBLISH') {
                        iconPublish?.classList.remove('hide');
                        iconPublish?.parentElement?.classList.remove('wide');
                    } else {
                        iconSave?.classList.remove('hide');
                        iconSave?.parentElement?.classList.remove('wide');
                    }
                    loadingScreen.classList.remove('m-loading-screen-active');
                    spinningPublish.classList.remove('show');
                    spinningDraft.classList.remove('show');
                    btnSubmit?.classList.remove('m-btn-submit');
                },
                complete: () => {
                    this.selectedFile = [];
                    this.message = '';
                    this.accountsValue = [];
                    loadingScreen.classList.remove('m-loading-screen-active');
                    spinningPublish.classList.remove('show');
                    spinningDraft.classList.remove('show');
                    btnSubmit?.classList.remove('m-btn-submit');

                    if (param == 'PUBLISH') {
                        this.shared.createMessage('success', 'published!');
                    } else {
                        this.shared.createMessage('success', 'saved to drafts!');
                    }

                    if (param == 'PUBLISH') {
                        iconPublish?.classList.remove('hide');
                        iconPublish?.parentElement?.classList.remove('wide');
                    } else {
                        iconSave?.classList.remove('hide');
                        iconSave?.parentElement?.classList.remove('wide');
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

    //upload image changes
    handleChange(event: any): void {
      let img = {
        id: 0,
        url: "",
        type: ""
      }

      if (event.fileList.length>0) {
        this.availableImages = true;
      } else {
        this.availableImages = false;
      }

      if (event.type == 'success') {
        this.mediaId = 0;
        this.urlLinks = [{ id: 0, url: "", type:"" }];

        event.fileList.forEach((elem: any) => {
          this.mediaId++;
          img.id = this.mediaId;
          img.url = elem.response.files.url;
          img.type = elem.response.files.type;
          this.urlLinks.push(img);
          this.refreshCarousel();
        })
        this.refreshPages();
      }
      else if (event.type == 'removed') {
        this.refreshPages();
        this.mediaId = 0;
        this.urlLinks = [{ id: 0, url: "", type:"" }];

        event.fileList.forEach((elem: any) => {
          this.mediaId++;
          img.id = this.mediaId;
          img.url = elem.response.files.url;
          img.type = elem.response.files.type;
          this.urlLinks.push(img);
          this.refreshCarousel();
        })
      }



    }

    handleCloseInsta(removedTag: {}): void {
        this.instaTags = this.instaTags.filter((tag) => tag !== removedTag);
    }

    handleCloseFb(removedTag: {}): void {
        this.fbTags = this.fbTags.filter((tag) => tag !== removedTag);
    }

    handleCloseMain(removedTag: {}): void {
        this.tags = this.tags.filter((tag) => tag !== removedTag);
        this.instaTags = this.instaTags.filter((tag) => tag !== removedTag);
        this.fbTags = this.fbTags.filter((tag) => tag !== removedTag);
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
            this.instaTags = [...this.instaTags, this.inputValue];
            this.fbTags = [...this.fbTags, this.inputValue];
        }
        this.inputValue = '';
        this.inputVisible = true;
    }

    handleInputConfirmInsta(): void {
        if (this.inputValueInsta) {
            this.instaTags = [...this.instaTags, this.inputValueInsta];
        }
        this.inputValueInsta = '';
        this.inputVisible = true;
    }

    handleInputConfirmFb(): void {
        if (this.inputValueFb) {
            this.fbTags = [...this.fbTags, this.inputValueFb];
        }
        this.inputValueFb = '';
        this.inputVisible = true;
    }

    tabChange1(id: any, event: any) {
        let list = [].slice.call(event.target.closest('li').parentNode.children);
        list.forEach((elem: any) => {
            elem.classList.remove('is-active');
        });
        event.target.closest('li').classList.add('is-active');
        this.tabId1 = id;
        if(id == 'instagram-tab-title') {
          this.instagramPreview = true;
          this.facebookPreview = false;
        } else if(id == 'facebook-tab-title') {
          this.instagramPreview = false;
          this.facebookPreview = true;
        }
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
        this.refreshCarousel();
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
        // this.postdata.post.post_media.forEach((el: any) => {
        //     let media: any = {
        //         url: el.url,
        //     }
        //     this.fileList.push(media);
        // })

        // this.postdata.post.tags.forEach((t: any) => {
        //     this.tags.push(t.name);
        // })
        // this.message = this.postdata.post.message;
    }

    refreshCarousel() {
        // waiting for better solution
        this.refresh = true;
        setTimeout(() => {
            this.refresh = false;
        }, 0.1)
    }

    collapse() {
        let menuButton = document.querySelector('.m-sidemenu-button');
        let midColDiv = document.querySelector('.m-collapse-menu-button');
        let menu = document.querySelector('.m-sidemenu');
        let midCol = document.querySelector('.m-mid-col');
        midColDiv?.classList.toggle('is-active');
        menuButton?.classList.toggle('is-active');
        menu?.classList.toggle('is-active');
        midCol?.classList.toggle('is-active');
    }

    collapseImageUpload() {
      this.showUploadVideo= false;
      this.uploadImageActive = !this.uploadImageActive;
    }

    updateMessage() {
        this.facebookMessage = this.message;
        this.instagramMessage = this.message;
    }

    checkMessage() {
        let mainTextField = document.getElementById("mainMessage");
        if (this.facebookMessage != this.message || this.instagramMessage != this.message) {
            mainTextField?.setAttribute("disabled", "true");
        } else {
            mainTextField?.removeAttribute("disabled");
        }
    }

    collapseVideoUpload() {
        this.showUploadVideo = !this.showUploadVideo
        this.uploadImageActive = false;
    }

    // TODO:: comment line for video display
    loadFile(e : Event) {
        let target = e.target as HTMLInputElement;
        // let video = document.getElementById("video") as HTMLVideoElement;
        if(target.files){
          this.availableVideos = true;
          let loadedFile = {id : this.videoCounter ,file :target.files[0]};
          this.videoList.push(loadedFile)
          this.selectedVideo = loadedFile;
          this.videoCounter++;
        }else {
          this.availableVideos = false;
        }

        // if (target.files?.length) {
            // this.selectedVideo = target.files[0];
            // var source = document.createElement('source');
            // importFileandPreview(this.selectedVideo).then((url) => {
                // source.setAttribute('src', url);
                // source.setAttribute('type', this.selectedVideo.type);
                // generateVideoThumbnails(this.selectedVideo , 1 , this.selectedVideo.type).then((thumbnails) => {
                    // video.style.width = "auto";
                    // video.style.height = "auto"
                    // video.style.transform = "scale(1)"
                // })
                // video.style.transform = "scale(1)"
                // video.innerHTML = "";
                // video.appendChild(source);
            // });
        // }
        this.refreshPages();
        this.generatethumbnails('next' , true);
        this.currentTimePosition = -10;
      }

      generatethumbnails(action : string , newVideo = false ){
        this.leadThumbnail = true
        if(action == "previous"){
            this.currentTimePosition -= this.duration ;
        }else if(action == "next"){
            this.currentTimePosition += this.duration ;
        }

        generateVideoThumbnails(this.selectedVideo.file, 3 , this.selectedVideo.file.type , this.currentTimePosition , this.duration ).then((thumbArray) => {
          this.listThumbnail = thumbArray;

          if(newVideo){
            this.selectedThumbnail.imgB64 = thumbArray[0].imgB64 as string ;
            this.selectedThumbnail.time = thumbArray[0].time as number ;
            this.selectedThumbnailList.push({id : this.selectedVideo.id , imgB64 : this.selectedThumbnail.imgB64 , time : this.selectedThumbnail.time })
          }
          this.leadThumbnail = false ;
        })
      }

      selectThumbnail(item : {imgB64 : '' , time : 0 } ){
            this.selectedThumbnail = item;

            this.selectedThumbnailList.forEach(selectedThumbnail => {
                if(selectedThumbnail.id == this.selectedVideo.id){
                    selectedThumbnail.imgB64 = item.imgB64 ;
                    selectedThumbnail.time = item.time ;
                }
            })
            // (document.getElementById("video") as HTMLVideoElement).setAttribute("poster", item.imgB64);
      }

      changeSelectedVideo(item : {id : number ,imgB64 : string , time : number}){
        this.selectedVideo = this.videoList.filter(video => item.id == video.id)[0];
        this.generatethumbnails('next');
        this.currentTimePosition = -10;
      }

      deleteVideo(item : {id : number ,imgB64 : string , time : number}){
        this.modal.confirm({
            nzTitle: 'Are you sure delete this video?',
            nzContent: '<b style="color: red;">remove video </b>',
            nzOkText: 'Yes',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => {
                this.selectedThumbnailList = this.selectedThumbnailList.filter((thumbnail) => item.id!=thumbnail.id  )
                this.videoList = this.videoList.filter((video) => item.id != video.id  )
                if(this.selectedVideo.id == item.id){
                    this.listThumbnail = [];
                }

                if(this.videoList.length>0) {
                  this.availableVideos = true;
                }else {
                  this.availableVideos = false;
                }
                this.refreshPages();
            },
            nzCancelText: 'No',
            nzOnCancel: () => console.log('Cancel', item)
        });
      }

      removeImage(event: any) {
        console.log('it finally worked!!!');
      }

      refreshPages() {
        if (this.availableImages && this.availableVideos) {
          this.getPages('instagram');
          this.notification
          .blank(
            'Reminder',
            "<strong>Facebook</strong> doesn't support images and videos on the same post."
          )
          .onClick.subscribe(() => {
            console.log('notification clicked!');
          });
        } else {
          this.getPages('mixed');
        }
      }

      showAlbumModal(){
        this.showAlbum = true;
      }

      handleOk(): void {
        this.showAlbum = false;
      }
    
      handleCancel(): void {
        this.showAlbum = false;
      }

      addToPost(event : any){
        // TODO:: list of images selected from album list
        console.log(event);
      }

}
