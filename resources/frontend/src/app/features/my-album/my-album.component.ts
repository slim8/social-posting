import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-album',
  templateUrl: './my-album.component.html',
  styleUrls: ['./my-album.component.scss']
})
export class MyAlbumComponent implements OnInit {

  thumbnails : any[]= [];
  checkedThumb : any = null;
  url : any;
  format : any;
  file : any;

  constructor() { }

  ngOnInit(): void {
  }

  capture(){
    var video = document.getElementById('video') as HTMLVideoElement;
    console.log(video.currentTime);
    video.currentTime = video.currentTime + 10 ;
    let div = document.createElement('div') ;
    let radio = document.createElement('input') ;
    radio.type = 'radio';
    radio.name = 'radio';
    radio.checked = true ;
    radio.id = video.currentTime.toString();
    radio.onchange = (event : Event) => {
      console.log( event );
      console.log( "event ==> ", (event.target as HTMLInputElement).id  );
      this.checkedThumb = (event.target as HTMLInputElement).id ;
    }

    div.appendChild(radio);

    var canvas = document.createElement('canvas');
    console.log(video.videoWidth, video.videoHeight);
    
    canvas?.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    div.appendChild(canvas);
    document.getElementById("preview")?.prepend(div);
      this.checkedThumb = video.currentTime.toString() ;
      this.thumbnails.push({id : video.currentTime.toString() ,time : video.currentTime , div : div});
  }

  save(){
    console.log(this.thumbnails);
    console.log(this.checkedThumb);
    console.log(this.thumbnails.filter(e  => e.id === this.checkedThumb )[0]);
    
  }

  
  onSelectFile(event : Event) {
    this.file = null;
    this.thumbnails = [];
    let target = event.target as HTMLInputElement;
    this.file = target.files && target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if(this.file.type.indexOf('video')> -1){
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

}
