import { Component, OnInit } from '@angular/core';
import { NzSkeletonInputSize, NzSkeletonParagraph } from 'ng-zorro-antd/skeleton';

@Component({
    selector: 'app-item-loader',
    templateUrl: './item-loader.component.html',
    styleUrls: ['./item-loader.component.scss']
})
export class ItemLoaderComponent implements OnInit {
    elementSize: NzSkeletonInputSize = 'small';
    paragraph: NzSkeletonParagraph = { rows: 2 };
    constructor() { }

    ngOnInit(): void {
    }

}
