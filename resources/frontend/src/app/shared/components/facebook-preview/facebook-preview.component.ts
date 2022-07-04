import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-facebook-preview',
  templateUrl: './facebook-preview.component.html',
  styleUrls: ['./facebook-preview.component.scss']
})
export class FacebookPreviewComponent implements OnInit {

  @Input() ThumbnailImg!: string;
  @Input() imgList: string[] = [];
  @Input() postDescription! : string;
  @Input() accountName! : string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.ThumbnailImg);
    
  }

}
