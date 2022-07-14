import { NzModalService } from 'ng-zorro-antd/modal';
import { PostService } from './../../shared/services/post.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { FacebookSocialService } from '../facebook-social/services/facebook-social.service';
import {importFileandPreview , generateVideoThumbnails} from './index';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';

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
    wasMixedTypes: boolean = false;

    //hashtags
    listOfOption: Array<{ label: string; value: string }> = [];
    listOfTagOptions = [];

    listOfOptionInsta: Array<{ label: string; value: string }> = [];
    listOfTagOptionsInsta = [];

    listOfOptionFacebook: Array<{ label: string; value: string }> = [];
    listOfTagOptionsFacebook = [];

    mentions: any = [];
    mediaId: number = 0;
    urlLinks: any[] = [{ id: 0, url: "", type:"" }];
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
    message: string = '';
    facebookMessage: string = '';
    instagramMessage: string = '';
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string; provider: string; pagePictureUrl: string }> =[];
    size: NzSelectSizeType = 'large';
    accountsValue: any[] = [];
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

    videosList: NzUploadFile[] = [];
    listOfVideos : { url : string , seconde : number , thumbnail : any}[] = []


    videoCounter = 0;
    videoList: {id : number ,file : File , videoUrl : string }[] = [];
    selectedThumbnailList : {id : number , imgB64 : string , time : number}[] = [];
    mediaList:any[] = [...this.urlLinks, ...this.selectedThumbnailList.map(r => {return { id:r.id, url: r.imgB64, type:"video" }})];
    showAlbum : boolean = false;

    constructor(
        private shared: SharedModule,
        private facebookSocialService: FacebookSocialService,
        private postService: PostService ,
        private modal: NzModalService,
        private notification: NzNotificationService,
        private router: Router,
        private sharedModule: SharedModule
    ) { }

    ngOnInit(): void {
      this.getPages('mixed');
      const mentioned = document.querySelector('.mentioned');
      if (this.router.url.includes('create-post')) {
        this.sharedModule.initSideMenu('create-post');
      }
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

    async uploadThumbnail(param: string){
      let list = this.videoList.map(video => {
        let thumbnail = this.selectedThumbnailList.filter((thumbnail) => thumbnail.id == video.id)[0];
        return { url : video.videoUrl , ...thumbnail , thumbnail: '' };
      })

      await list.forEach((videoObject) => {
         this.postService.uploadFileB64(videoObject.imgB64).subscribe({
          next: (response ) => {
            
            this.listOfVideos.push({url : videoObject.url , seconde : videoObject.time ,thumbnail : response.files.url }) ;
          },
          error: (err) => {
            this.shared.createMessage('error', err);
          },
          complete: () => {
            
          }
        });
      })
      setTimeout(() => {
        this.submitForm(param)
      }, 2000);
      
    }

    submitForm(param: string) {
      let loadingScreen = document.getElementsByClassName('m-loading-screen')[0];
      let btnSubmit = document.getElementById('btn-submit');
      let iconSave = document.querySelector('.m-button-icon-save');
      let iconPublish = document.querySelector('.m-button-icon-publish');
      let spinningDraft = document.getElementsByClassName('m-loading-spin')[0];
      let spinningPublish = document.getElementsByClassName('m-loading-spin')[1];

      const formData: FormData = new FormData();

      this.listOfVideos.forEach((videoObject)=> {
        formData.append('videos[]', JSON.stringify(videoObject));
      })

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

      if (this.tags.length > 0) {
        this.tags.forEach((tag: any) => {
          formData.append('tags[]', tag);
        });
      }

      if (this.mentions.length > 0) {
        formData.append('mentions', JSON.stringify(this.mentions));
      }

      if (this.urlLinks.length > 0) {
        this.urlLinks.forEach((media: any) => {
          if(media.url!=""){
            formData.append('images[]', media.url);
          }
        });
      }

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
      if (event.fileList.length>0) {
        this.availableImages = true;
      } else {
        this.availableImages = false;
      }

      if (event.type == 'success') {
        this.mediaId = 0;
        this.urlLinks = [{ id: 0, url: "", type:"" }];
        event.fileList.forEach((elem: any) => {
          let img = {
            id: 0,
            url: "",
            type: ""
          }
          this.mediaId++;
          img.id = this.mediaId;
          img.url = elem.response.files.url;
          img.type = elem.response.files.type;
          this.urlLinks.push(img);
          this.refreshPreview();
        })
        this.refreshPages();
      }
      else if (event.type == 'removed') {
        this.refreshPages();
        this.mediaId = 0;
        this.urlLinks = [{ id: 0, url: "", type:"" }];

        event.fileList.forEach((elem: any) => {
          let img = {
            id: 0,
            url: "",
            type: ""
          }
          this.mediaId++;
          img.id = this.mediaId;
          img.url = elem.response.files.url;
          img.type = elem.response.files.type;
          this.urlLinks.push(img);
          this.refreshPreview();
        })
      }
      this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => {return { id:r.id, url: r.imgB64, type:"video" }})];
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
      if(!event.target.closest('li').classList.contains('is-blocked')) {
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

    resetSuccess() {
        let successDialog = document.getElementById('successDialog');
        successDialog?.classList.add('is-hidden');
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

    refreshPreview() {
        // looking for a better solution
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
      this.refreshPreview();
    }

    selectThumbnail(item : {imgB64 : '' , time : 0 } ){
          this.selectedThumbnail = item;


          this.selectedThumbnailList.forEach(selectedThumbnail => {
              if(selectedThumbnail.id == this.selectedVideo.id){
                  selectedThumbnail.imgB64 = item.imgB64;
                  selectedThumbnail.time = item.time;
              }
          })
          this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => {return { id:r.id, url: r.imgB64, type:"video" }})];
          // (document.getElementById("video") as HTMLVideoElement).setAttribute("poster", item.imgB64);
    }

    //upload image changes
    uploadVideo(event: any): void {
      if(event.type === "success"){
        console.log(event)
        if(event.file){
          this.availableVideos = true;
          let loadedFile = {id : this.videoCounter ,file :event.file.originFileObj , videoUrl : event.file.response.files.url  };
          this.videoList.push(loadedFile)
          this.selectedVideo = loadedFile;
          this.videoCounter++;
        }else {
          this.availableVideos = false;
        }
        this.refreshPages();
        this.generatethumbnails('next' , true);
        this.currentTimePosition = -10;
        setTimeout(() => {
          this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => {return { id:r.id, url: r.imgB64, type:"video" }})];
          this.refreshPreview();
        }, 2500);
      }
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
              let removedVideo = this.videoList.filter((video) => item.id == video.id  )[0]
              this.videoList = this.videoList.filter((video) => item.id != video.id  )

              console.log(this.videosList);
              
              this.videosList = this.videosList.filter((video) => removedVideo.videoUrl != video.response.files.url  )

              console.log(this.videosList);

              if(this.selectedVideo.id == item.id){
                  this.listThumbnail = [];
              }

              if(this.videoList.length>0) {
                this.availableVideos = true;
              }else {
                this.availableVideos = false;
              }
              this.refreshPages();
              this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => {return { id:r.id, url: r.imgB64, type:"video" }})];
          },
          nzCancelText: 'No',
          nzOnCancel: () => console.log('Cancel', item)
      });
    }

    removeImage(event: any) {
      console.log('it finally worked!!!');
    }

    refreshPages() {
      let instaTab = document.getElementById('instagram-tab-title');
      let fbTab = document.getElementById('facebook-tab-title');
      if (this.availableImages && this.availableVideos) {
        if(!instaTab?.classList.contains('is-active')) instaTab?.classList.add('is-active');
        fbTab?.classList.remove('is-active');
        fbTab?.classList.add('is-blocked');
        this.instagramPreview = true;
        this.facebookPreview = false;
        this.tabId1='instagram-tab-title';
        this.getPages('instagram');
        this.notification
        .blank(
          'Reminder',
          "<strong>Facebook</strong> doesn't support images and videos on the same post."
        )
        .onClick.subscribe(() => {
          console.log('notification clicked!');
        });
        this.wasMixedTypes = true;
      } else {
        fbTab?.classList.remove('is-blocked');
        if(this.wasMixedTypes) {
          this.getPages('mixed');
        }
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

  addMentions(event:any[]) {
    this.mentions = event;
    console.log(this.mentions)
  }

  addToPost(event : any){
    // TODO:: list of images selected from album list
    console.log(event);
  }

}
