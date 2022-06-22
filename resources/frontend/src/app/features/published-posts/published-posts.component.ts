import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'app-published-posts',
    templateUrl: './published-posts.component.html',
    styleUrls: ['./published-posts.component.scss']
})
export class PublishedPostsComponent implements OnInit {
    public gfg = false;
    constructor() { }


    ngOnInit(): void {
    }

}
