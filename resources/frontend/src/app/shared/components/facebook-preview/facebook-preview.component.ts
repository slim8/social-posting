import { NzIconService } from 'ng-zorro-antd/icon';
import { Component, OnInit, Input } from '@angular/core';

const threeDot = '<svg width="59" height="69" viewBox="0 0 59 69" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_113_5588)"><path d="M12 57V12L47 34.5L12 57Z" fill="white"/><path d="M12 57V12L47 34.5L12 57Z" stroke="white" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/></g><defs><filter id="filter0_d_113_5588" x="0.5" y="0.5" width="58" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="1.5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_113_5588"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_113_5588" result="shape"/></filter></defs></svg>';
@Component({
  selector: 'app-facebook-preview',
  templateUrl: './facebook-preview.component.html',
  styleUrls: ['./facebook-preview.component.scss']
})
export class FacebookPreviewComponent implements OnInit {

  @Input() ThumbnailImg!: string;
  @Input() imgList: any[] = [];
  @Input() postDescription! : string;
  @Input() accountName! : string;

  constructor( private iconService: NzIconService, ) {
    this.iconService.addIconLiteral('ng-zorro:dashboard', threeDot);
   }

  ngOnInit(): void {
  }

}
