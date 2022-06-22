import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-collapse-item',
    templateUrl: './collapse-item.component.html',
    styleUrls: ['./collapse-item.component.scss']
})
export class CollapseItemComponent implements OnInit {
    public gfg = false;
    constructor() { }

    ngOnInit(): void {
    }

}
