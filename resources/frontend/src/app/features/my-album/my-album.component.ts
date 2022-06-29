import { Component, OnInit } from '@angular/core';
import {importFileandPreview , generateVideoThumbnails} from './index'
@Component({
  selector: 'app-my-album',
  templateUrl: './my-album.component.html',
  styleUrls: ['./my-album.component.scss']
})
export class MyAlbumComponent implements OnInit {


  video = document.getElementById("video") as HTMLVideoElement;
  inputFile = document.getElementById("inputfile") as HTMLInputElement;
  videoUrl = document.getElementById("videoUrl") as HTMLInputElement;
  numberInput = document.getElementById("numberofthumbnails") as HTMLInputElement ;
  numberWrapper = document.getElementById("numberWrapper") as HTMLDivElement ;
  fileControls = document.getElementById("fileControls") as HTMLDivElement ;
  buttonWrapper = document.getElementById("buttonWrapper") as HTMLDivElement ;
  urlbuttonwrapper = document.getElementById("urlbuttonwrapper") as HTMLDivElement ;
  thumbButton = document.getElementById("generatethumbnails") as HTMLButtonElement;
  thumbnaislWrapper = document.getElementById("thumbnails") as HTMLDivElement;
  loader = document.getElementById("loader") as HTMLDivElement;
  selectbuttons = document.getElementById("selectbuttons") as HTMLDivElement;
  urlbtn = document.getElementById("urlbtn") as HTMLButtonElement;
  filebtn = document.getElementById("filebtn") as HTMLButtonElement;
  selectedFile :any = null;

  currentTimePosition = 0;
  duration = 10;

  constructor() { }

  ngOnInit(): void {

  }

  showUrl(){
  let selectbuttons = document.getElementById("selectbuttons") as HTMLDivElement;
  let inputFile = document.getElementById("inputfile") as HTMLInputElement;
  let fileControls = document.getElementById("fileControls") as HTMLDivElement ;
  let numberWrapper = document.getElementById("numberWrapper") as HTMLDivElement ;
  let urlbuttonwrapper = document.getElementById("urlbuttonwrapper") as HTMLDivElement ;
    selectbuttons.style.display = "none";
    inputFile.style.display = "none";
    fileControls.style.display = "flex";
    numberWrapper.style.display = "block"
    urlbuttonwrapper.style.display = "block"
  }

  showFile(){
  let selectbuttons = document.getElementById("selectbuttons") as HTMLDivElement;
  let fileControls = document.getElementById("fileControls") as HTMLDivElement ;
  let videoUrl = document.getElementById("videoUrl") as HTMLInputElement;
  console.log(selectbuttons);
    
    selectbuttons.style.display = "none";
    fileControls.style.display = "flex";
    videoUrl.style.display = "none"
  }

  loadFile(e : Event){
    let target = e.target as HTMLInputElement;
    let video = document.getElementById("video") as HTMLVideoElement;
    let numberWrapper = document.getElementById("numberWrapper") as HTMLDivElement ;
    let buttonWrapper = document.getElementById("buttonWrapper") as HTMLDivElement ;
    if (target.files?.length) {
      this.selectedFile = target.files[0];
      var source = document.createElement('source');
          importFileandPreview(this.selectedFile).then((url) => {
          source.setAttribute('src', url);
          source.setAttribute('type', this.selectedFile.type);
          generateVideoThumbnails(this.selectedFile , 1 , this.selectedFile.type).then((thumbnails) => {
            // video operations
            // video.setAttribute("poster", thumbnails[1])
            // video.setAttribute("src", url)
            video.style.width = "auto";
            video.style.height = "auto"
            video.style.transform = "scale(1)"
          })
          // numberInput
          numberWrapper.style.display = "block";
          buttonWrapper.style.display = "block";
          video.style.transform = "scale(1)"
          video.innerHTML = "";
          video.appendChild(source);
          
        });
    }
    this.generatethumbnails();
  }

  generatethumbnails(){
    let thumbnaislWrapper = document.getElementById("thumbnails") as HTMLDivElement;
    let loader = document.getElementById("loader") as HTMLDivElement;
    let numberInput = document.getElementById("numberofthumbnails") as HTMLInputElement ;
   
    thumbnaislWrapper.innerHTML = "";
    loader.style.display = "block";
    generateVideoThumbnails(this.selectedFile, 4 , this.selectedFile.type , this.currentTimePosition , this.duration ).then((thumbArray) => {
      // console.log(thumbArray);
      this.currentTimePosition += this.duration ;
      let thumbnailsImg = thumbArray.map((item) => {
        let img = document.createElement('img');
        img.src = item;
        img.alt = "";
        img.style.width = "200px";
        img.style.objectFit = "cover";
        img.style.margin = "10px";
        img.style.cursor = "pointer";
        img.addEventListener("click", function() {
          (document.getElementById("video") as HTMLVideoElement).setAttribute("poster", item);
        })
        return img;
      })
      thumbnaislWrapper.innerHTML = "";
      loader.style.display = "none";
      thumbnailsImg.forEach((item) => {
        thumbnaislWrapper.appendChild(item);
      })
    })
  }

  generatethumbnailsfromurl(){
    this.thumbnaislWrapper.innerHTML = "";
    this.loader.style.display = "block";
    this.video.style.width = "auto";
    this.video.style.height = "auto"
    this.video.style.transform = "scale(1)";
    this.video.setAttribute("src", this.videoUrl.value);
      // import("./index.js").then((res) => {
        // res.generateVideoThumbnails(this.videoUrl.value, parseInt(this.numberInput.value), "url").then((thumbArray) => {
        generateVideoThumbnails(this.selectedFile.value, parseInt(this.numberInput.value), "url").then((thumbArray) => {
          let thumbnailsImg = thumbArray.map((item) => {
            let img = document.createElement('img');
            img.src = item;
            img.alt = "";
            img.style.width = "200px";
            img.style.objectFit = "cover";
            img.style.margin = "10px";
            img.style.cursor = "pointer";
            img.addEventListener("click", function() {
              (document.getElementById("video") as HTMLVideoElement).setAttribute("poster", item);
            })
            return img;
          })
          this.thumbnaislWrapper.innerHTML = "";
          this.loader.style.display = "none";
          thumbnailsImg.forEach((item) => {
            this.thumbnaislWrapper.appendChild(item);
          })
        // }).catch((err) => {
        //   this.thumbnaislWrapper.innerHTML = "";
        //   this.loader.style.display = "none";
        //   let p = document.createElement("p")
        //   p.innerHTML = JSON.stringify(err);
        //   this.thumbnaislWrapper.appendChild(p);
        // })
      });
  }
   
  


}
