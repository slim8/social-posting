import { PostService as SocialAccountsPostService } from './../social-accounts/services/post.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PostService } from './../../shared/services/post.service';
import { Component, OnInit } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookSocialService } from '../facebook-social/services/facebook-social.service';
import { generateVideoThumbnails } from './index';
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
export class CreatePostComponent implements OnInit {
    isLoading = false;

    // pre-selected page
    pageId: string = "";

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
    listBeforeChange: any[] = [];
    listOfOption: Array<{ label: string; value: string }> = [];
    listOfTagOptions = [];

    listOfOptionInsta: Array<{ label: string; value: string }> = [];
    listOfTagOptionsInsta: any[] = [];

    listOfOptionFacebook: Array<{ label: string; value: string }> = [];
    listOfTagOptionsFacebook: any[] = [];

    mentions: any[] = [];
    mediaId: number = 0;
    urlLinks: any[] = [];
    instaTags: string[] = [];
    fbTags: string[] = [];
    tabId1: any = 'instagram-tab-title';
    message: string = '';
    facebookMessage: string = '';
    instagramMessage: string = '';
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    listOfPages: Array<{ id: number; pageName: string; provider: string; pagePictureUrl: string }> = [];
    size: NzSelectSizeType = 'large';
    accountsValue: any[] = [];
    showUploadVideo = false;
    selectedVideo: any = null;
    selectedThumbnail = {
        imgB64: '',
        time: 0
    };
    listThumbnail: { imgB64: any, time: any }[] = [];
    leadThumbnail: Boolean = false;
    currentTimePosition = -10;
    duration = 10;

    videosList: NzUploadFile[] = [];
    listOfVideos: { url: string, seconde: number, thumbnail: any }[] = []

    videoCounter = 0;
    videoList: { id: number, file: File|null, videoUrl: string , duration : number |null }[] = [];
    selectedThumbnailList: { id: number, imgB64: string |null , time: number , url :  string |null}[] = [];
    mediaList: any[] = [...this.urlLinks, ...this.selectedThumbnailList.map(r => { return { id: r.id, url: r.imgB64 ? r.imgB64 : r.url, type: "video" } })];
    showAlbum: boolean = false;
    avatarUrl:string = "";
    pageName:string = "";

    editDraftMode : boolean = false;
    editDraftPost ={id : ''};

    constructor(
        private shared: SharedModule,
        private facebookSocialService: FacebookSocialService,
        private postService: PostService,
        private SocialAccountsPostService: SocialAccountsPostService,
        private modal: NzModalService,
        private notification: NzNotificationService,
        private router: Router,
        private sharedModule: SharedModule,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.getPages('mixed', true);
        const mentioned = document.querySelector('.mentioned');
        if (this.router.url.includes('create-post')) {
            this.sharedModule.initSideMenu('create-post');
        }
        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.pageId = params['id'];
            }
        });

    }

    getPages(param: string , fromInit = false) {
        this.listOfPages = [];
        this.accountsValue = [];
        this.facebookSocialService.getCurrentApprovedFBPages().subscribe({
            next: (event: any) => {
                this.listOfPages = new Array();
                event.pages.forEach((page: any) => {
                    if (param == 'mixed') {
                        if (page.isConnected == true) {
                            this.listOfPages.push(page);
                        }
                        if (this.pageId != "") {
                            if (page.id == this.pageId) {
                                let selectedPage = page.id + "|" + page.provider;
                                this.accountsValue.push(selectedPage);
                            }
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
                if (this.router.url.includes('drafts') && fromInit ) {
                    this.getDraftToEdit(this.activatedRoute.snapshot.paramMap.get('draft'));
                }
            }
        });
    }

    validateForm(): boolean {
      let validator = false;
      let accountsFormController = document.getElementById('accountsFormController');
      let mediasFormController = document.getElementById('mediasFormController');
      accountsFormController?.classList.remove('m-shown');
      accountsFormController?.classList.add('m-hidden');

      if(this.accountsValue.length > 0) {
        accountsFormController?.classList.remove('m-shown');
        accountsFormController?.classList.add('m-hidden');
        validator = true;
      } else if (this.accountsValue.length == 0  ){
        accountsFormController?.classList.add('m-shown');
      }

      else if(this.mediaList.length > 0 ) {
        mediasFormController?.classList.remove('m-shown');
        mediasFormController?.classList.add('m-hidden');
        accountsFormController?.classList.remove('m-shown');
        accountsFormController?.classList.add('m-hidden');
        validator = true;
      } else if(this.mediaList.length == 0) {
        mediasFormController?.classList.add('m-shown');
        accountsFormController?.classList.remove('m-shown');
        accountsFormController?.classList.add('m-hidden');
      }

      return validator;
    }


    validateAccount() {
      let accountsFormController = document.getElementById('accountsFormController');
      accountsFormController?.classList.remove('m-shown');
      accountsFormController?.classList.add('m-hidden');

      if(this.accountsValue.length > 0) {
        accountsFormController?.classList.remove('m-shown');
        accountsFormController?.classList.add('m-hidden');
      } else if (this.accountsValue.length == 0  ){
        accountsFormController?.classList.add('m-shown');
      }
    }

    validateMedia() {
      let mediasFormController = document.getElementById('mediasFormController');
      mediasFormController?.classList.remove('m-shown');
      mediasFormController?.classList.add('m-hidden');

      if(this.mediaList.length > 0 ) {
        mediasFormController?.classList.remove('m-shown');
        mediasFormController?.classList.add('m-hidden');
      } else if(this.mediaList.length == 0) {
        mediasFormController?.classList.add('m-shown');
      }
    }




    accountChange(){
      this.validateAccount();
      if(this.accountsValue.length == 1) {
        this.listOfPages.forEach((elem:any)=> {
          if(elem.id == this.accountsValue[0].split("|", 1)) {
            this.avatarUrl = elem.pagePictureUrl;
            this.pageName = elem.pageName;
          }
        })
      }
    }

    mediaChange(){
      this.validateMedia();
    }
    async uploadThumbnail(param: string) {
      let validator = this.validateForm();
      if(validator) {
        this.listOfVideos = [];
        this.isLoading = true;
        let list = this.videoList.map(video => {
            let thumbnail = this.selectedThumbnailList.filter((thumbnail) => thumbnail.id == video.id)[0];
            return { url: video.videoUrl , id: thumbnail.id,imgB64: thumbnail.imgB64 , time: thumbnail.time , thumbnail: thumbnail.url ? thumbnail.url: '' };
        })

        let compteur = list.length;
        await list.forEach(async (videoObject) => {
            if(videoObject.imgB64){
                await this.postService.uploadFileB64(videoObject.imgB64).subscribe({
                    next: (response) => {
                        this.listOfVideos.push({ url: videoObject.url, seconde: videoObject.time, thumbnail: response.files.url });
                        compteur--;
                    },
                    error: (err) => {
                        this.shared.createMessage('error', err);
                    },
                    complete: () => {
                        if(compteur <= 0){
                            this.submitForm(param);
                        }
                    }
                });
            }else{
                compteur--;
                if(compteur <= 0){
                    this.submitForm(param);
                }
            }
        })
      }
    }

    submitForm(param: string) {
      this.isLoading = true;
      const formData: FormData = new FormData();
      this.listOfVideos.forEach((videoObject) => {
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
              post.hashtags = this.listOfTagOptionsFacebook;
              post.mentions = this.mentions;
              post.accountId = id;
              post.videoTitle = "";
          } else if (accountId.includes('instagram')) {
              post.message = this.instagramMessage;
              post.hashtags = this.listOfTagOptionsInsta;
              post.mentions = this.mentions;
              post.accountId = id;
              post.videoTitle = "";
          }
          formData.append('posts[]', JSON.stringify(post));
      });

      if (this.listOfTagOptions.length > 0) {
          this.listOfTagOptions.forEach((tag: any) => {
              formData.append('tags[]', tag);
          });
      }

      if (this.mentions.length > 0) {
          formData.append('mentions', JSON.stringify(this.mentions));
      }

      if (this.urlLinks.length > 0) {
          this.urlLinks.forEach((media: any) => {
              if (media.url != "") {
                  formData.append('images[]', media.url);
              }
          });
      }

      formData.append('status', param);
      formData.append('message', this.message);

        if(this.editDraftMode){
            formData.append('originalId', this.editDraftPost.id);
            this.videosList.forEach((videoObject) => {
                if(videoObject['seconde']){
                    formData.append('videos[]', JSON.stringify({ url: videoObject.url, seconde: videoObject['seconde'] , thumbnail: videoObject.thumbUrl }));
                }
            })
        }

        if (formData) {
            this.facebookSocialService.postToSocialMedia(formData).subscribe({
                next: (event) => {

              },
              error: (err) => {
                  if (err.error.errors) {
                    Object.keys(err.error.errors).forEach(key => {
                      this.shared.createMessage('error', err.error.errors[key][0]);
                    });
                  }
                  else {
                      this.shared.createMessage('error', err.error.message);
                  }
                  this.isLoading = false;
              },
              complete: () => {
                  this.isLoading = false;
                  this.message = '';
                  this.accountsValue = [];
                  if (param == 'PUBLISH') {
                      this.shared.createMessage('success', 'published!');
                      this.router.navigateByUrl('/application/published-posts')

                  } else {
                      this.shared.createMessage('success', 'saved to drafts!');
                      this.router.navigateByUrl('/application/drafts')

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
        if (event.fileList.length > 0) {
            this.availableImages = true;
        } else {
            this.availableImages = false;
        }

        if (event.type == 'success') {
            this.mediaId = 0;
            this.urlLinks = [];
            event.fileList.forEach((elem: any) => {
                let img = {
                    id: 0,
                    url: "",
                    type: ""
                }
                this.mediaId++;
                img.id = this.mediaId;
                if(elem.response){
                    img.url = elem.response.files.url;
                    img.type = elem.response.files.type;
                }else{
                    img.url = elem.url;
                    img.type = 'image';
                }

                this.urlLinks.push(img);
            })

            this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => { return { id: r.id, url: r.imgB64 ? r.imgB64 : r.url, type: "video" } })];
            this.mediaChange();
        }
        else if (event.type == 'removed') {
            this.refreshPages();
            this.mediaId = 0;
            this.urlLinks = [];

            event.fileList.forEach((elem: any) => {
                let img = {
                    id: 0,
                    url: "",
                    type: ""
                }
                this.mediaId++;
                img.id = this.mediaId;
                if(elem.response){
                    img.url = elem.response.files.url;
                    img.type = elem.response.files.type;
                }else{
                    img.url = elem.url;
                    img.type = 'image';
                }
                this.urlLinks.push(img);
            })
            this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => { return { id: r.id, url: r.imgB64 ? r.imgB64 : r.url, type: "video" } })];
            this.mediaChange();
        }
    }

    tabChange(id: any, event: any) {
        if (!event.target.closest('li').classList.contains('is-blocked')) {
            let list = [].slice.call(event.target.closest('li').parentNode.children);
            list.forEach((elem: any) => {
                elem.classList.remove('is-active');
            });
            event.target.closest('li').classList.add('is-active');
            this.tabId1 = id;
            if (id == 'instagram-tab-title') {
                this.instagramPreview = true;
                this.facebookPreview = false;
            } else if (id == 'facebook-tab-title') {
                this.instagramPreview = false;
                this.facebookPreview = true;
            }
        }
    }

    resetSuccess() {
        let successDialog = document.getElementById('successDialog');
        successDialog?.classList.add('is-hidden');
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
        this.showUploadVideo = false;
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

    generatethumbnails(action: string, newVideo = false) {
        this.leadThumbnail = true

        if (action == "previous" && this.currentTimePosition > 10) {
            this.currentTimePosition -= this.duration;
        } else if (action == "next" && this.currentTimePosition < this.selectedVideo.duration - 10 ) {
            this.currentTimePosition += this.duration;
        }

        generateVideoThumbnails(this.selectedVideo.videoUrl, 3, 'url', this.currentTimePosition, this.duration).then((thumbArray) => {
            this.listThumbnail = thumbArray;

            if (newVideo) {
                this.selectedThumbnail.imgB64 = thumbArray[0].imgB64 as string;
                this.selectedThumbnail.time = thumbArray[0].time as number;
                this.selectedThumbnailList.push({ id: this.selectedVideo.id, imgB64: this.selectedThumbnail.imgB64, time: this.selectedThumbnail.time , url : null})
            }
            this.leadThumbnail = false;
        })

    }

    generateVideoDurationFromUrl = (url: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            let video = document.createElement("video");
            video.addEventListener("loadeddata", function () {
                resolve(video.duration);
                window.URL.revokeObjectURL(url);
            });
            video.preload = "metadata";
            video.src = url;
            // Load video in Safari / IE11
            video.muted = true;
            video.crossOrigin = "Anonymous";
            video.playsInline = true;
            video.play();
        })
    }

    selectThumbnail(item: { imgB64: '', time: 0 }) {
        this.selectedThumbnail = item;


        this.selectedThumbnailList.forEach(selectedThumbnail => {
            if (selectedThumbnail.id == this.selectedVideo.id) {
                if(!selectedThumbnail.imgB64){
                    this.videosList = this.videosList.filter(video => video.uid != selectedThumbnail.id.toString())
                }
                selectedThumbnail.imgB64 = item.imgB64;
                selectedThumbnail.time = item.time;
            }
        })
        this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => { return { id: r.id, url: r.imgB64 ? r.imgB64 : r.url, type: "video" } })];
    }

    //upload image changes
    uploadVideo(event: any): void {
        if (event.type === "success") {
            if (event.file) {
                this.availableVideos = true;
                let tempVideoEl = document.createElement('video');
                let that = this;
                tempVideoEl.addEventListener('loadedmetadata', function() {
                    let loadedFile = { id: that.videoCounter, file: event.file.originFileObj, videoUrl: event.file.response.files.url , duration : tempVideoEl.duration };
                    that.videoList.push(loadedFile)
                    that.selectedVideo = loadedFile;
                    that.videoCounter++;
                    that.generatethumbnails('next', true);
                    that.currentTimePosition = -10;
                    that.refreshPages();
                    setTimeout(() => {
                        that.mediaList = [...that.urlLinks, ...that.selectedThumbnailList.map(r => { return { id: r.id, url: r.imgB64 ? r.imgB64 : r.url, type: "video" } })];
                        that.validateForm();
                    }, 2500);
                });
                tempVideoEl.src = window.URL.createObjectURL(event.file.originFileObj);

                // TODO:: end video duration
            } else {
                this.availableVideos = false;
            }

        }
    }

    changeSelectedVideo(item: { id: number, imgB64:  string|null, time: number , url : string|null }) {
        this.selectedVideo = this.videoList.filter(video => item.id == video.id)[0];
        this.generateVideoDurationFromUrl(this.selectedVideo.videoUrl).then(res => {
            if(!this.selectedVideo.duration){
                this.videoList = this.videoList.map(video => {
                    if(this.selectedVideo.id == video.id){
                        video.duration = res
                    }
                    return video ;
                } );
            }
            this.currentTimePosition = -10;
            this.generatethumbnails('next');
        })

    }

    deleteVideo(item: { id: number, imgB64: string|null, time: number , url : string|null }) {
        this.modal.confirm({
            nzTitle: 'Are you sure delete this video?',
            nzContent: '<b style="color: red;">remove video </b>',
            nzOkText: 'Yes',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => {
                this.selectedThumbnailList = this.selectedThumbnailList.filter((thumbnail) => item.id != thumbnail.id)
                let removedVideo = this.videoList.filter((video) => item.id == video.id)[0]
                this.videoList = this.videoList.filter((video) => item.id != video.id)
                this.videosList = this.videosList.filter((video) => removedVideo.videoUrl != video.response.files.url)
                if (this.selectedVideo.id == item.id) {
                    this.listThumbnail = [];
                }

                if (this.videoList.length > 0) {
                    this.availableVideos = true;
                } else {
                    this.availableVideos = false;
                }
                this.refreshPages();
                this.mediaList = [...this.urlLinks, ...this.selectedThumbnailList.map(r => { return { id: r.id, url: r.imgB64 ? r.imgB64 : r.url, type: "video" } })];
            },
            nzCancelText: 'No',
            nzOnCancel: () => {}
        });
    }

    refreshPages() {
        let instaTab = document.getElementById('instagram-tab-title');
        let fbTab = document.getElementById('facebook-tab-title');
        if (this.availableImages && this.availableVideos) {
            if (!instaTab?.classList.contains('is-active')) instaTab?.classList.add('is-active');
            fbTab?.classList.remove('is-active');
            fbTab?.classList.add('is-blocked');
            this.instagramPreview = true;
            this.facebookPreview = false;
            this.tabId1 = 'instagram-tab-title';
            this.getPages('instagram');
            this.notification
                .blank(
                    'Reminder',
                    "<strong>Facebook</strong> doesn't support images and videos on the same post."
                )
                .onClick.subscribe(() => {
                });
            this.wasMixedTypes = true;
        } else {
            fbTab?.classList.remove('is-blocked');
            if (this.wasMixedTypes) {
                this.getPages('mixed');
            }
        }
    }

    showAlbumModal() {
        this.showAlbum = true;
    }

    handleOk(): void {
        this.showAlbum = false;
    }

    handleCancel(): void {
        this.showAlbum = false;
    }

    addMentions(event: any[]) {
        this.mentions = event;
    }

    addToPost(event: any) {
    }

    mergeHashtags(e: any) {
        if (this.listBeforeChange.length > e.length) {
            let diffValue = this.listBeforeChange.filter(res => (!e.includes(res)));
            this.listOfTagOptionsFacebook = this.listOfTagOptionsFacebook.filter(res => (!diffValue.includes(res)))
            this.listOfTagOptionsInsta = this.listOfTagOptionsInsta.filter(res => (!diffValue.includes(res)))
        }
        else {
            this.listOfTagOptionsFacebook = this.uniqByForEach([...e, ...this.listOfTagOptionsFacebook]);
            this.listOfTagOptionsInsta = this.uniqByForEach([...e, ...this.listOfTagOptionsInsta]);
        }
        this.listBeforeChange = e;
    }

    uniqByForEach<T>(array: T[]) {
        const result: T[] = [];
        array.forEach((item) => {
            if (!result.includes(item)) {
                result.push(item);
            }
        })
        return result;
    }

    getDraftToEdit(draft : string | null){
        this.editDraftMode = true ;
        this.SocialAccountsPostService.getDraft(draft).subscribe({
            next: (event: any) => {

                this.editDraftPost = event.post;

                let imageList  : NzUploadFile[] = event.post.postMedia.filter((item : {type: string}) => item.type == "image").map((item : { id: 0,url: string,type: string,postId: 0,mentions: []} , key : any) => {
                        // TODO :: to show mention on edit draft
                        // this.mentions.push(...item.mentions.map((montion : {username : string , posX : string , posY : string , id : number}) => ({
                        //     username : montion.username ,
                        //     posX : montion.posX,
                        //     posY : montion.posY,
                        //     image : key ,
                        //     id : montion.id
                        // })));
                        let img = {
                            id: 0,
                            url: "",
                            type: ""
                        }
                        this.mediaId++;
                        img.id = this.mediaId;
                        img.url = item.url;
                        img.type = item.type;
                        this.urlLinks.push(img);

                    return {
                            uid: -(key+1) ,
                            name: item.url ,
                            status: 'done',
                            url: item.url,
                            thumbUrl: item.url
                          }
                } )
                this.fileList = [...imageList];
                this.message = event.post.message ;
                this.mediaList.push( ...imageList.map(item => ({ id: item.uid, url: item.url, type: "image" }) ))

                let DraftVideoList : NzUploadFile[] = event.post.postMedia.filter((item : {type: string}) => item.type == "video").map((item : { id: 0,url: string,type: string,postId: 0,mentions: [] , thumbnailLink : string , thumbnailSeconde : string} , key : any) => {

                    this.mediaList.push( { id: -(key+1), url: item.thumbnailLink, type: "video" })
                    this.videoList.push({ id: -(key+1), file: null , videoUrl: item.url , duration : null });
                    this.selectedThumbnailList.push( { id: -(key+1) , imgB64: null, time: +item.thumbnailSeconde , url : item.thumbnailLink});

                    return {
                            uid: -(key+1) ,
                            name: item.url ,
                            status: 'done',
                            url: item.url,
                            seconde: item.thumbnailSeconde,
                            thumbUrl: item.thumbnailLink
                          }
                } )

                this.videosList = [...DraftVideoList];

                    let selectedAccountId = event.post.subPosts.map((item : {accountId : any , provider : string , message : string , hashtags : [{name : string}]}) => {



                        if(item.provider == "facebook"){
                            this.facebookMessage = item.message;
                            if(item.hashtags.length){
                                this.listOfTagOptionsFacebook = [...item.hashtags.map(tag => tag.name)]
                            }
                        }else if(item.provider == "instagram"){
                            this.instagramMessage = item.message;
                            if(item.hashtags.length){
                                this.listOfTagOptionsInsta = [...item.hashtags.map(tag => tag.name)]
                            }
                        }

                        return item.accountId;
                    } )
                    let selectedAccount = this.listOfPages.filter((item : {id : any}) => selectedAccountId.includes(item.id)).map(item => item.id+'|'+item.provider )
                    this.accountsValue = [...selectedAccount];

            },
            error: err => {

            },
            complete: () => {

            }
        });
    }
}
