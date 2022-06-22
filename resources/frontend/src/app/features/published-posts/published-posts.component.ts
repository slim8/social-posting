import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CollapseHeaderComponent } from './components/collapse-header/collapse-header.component';

@Component({
    selector: 'app-published-posts',
    templateUrl: './published-posts.component.html',
    styleUrls: ['./published-posts.component.scss']
})
export class PublishedPostsComponent implements OnInit {

    panels = [
        {
            active: true,
            name: '<h1>This is panel header 1</h1>',
            disabled: false
        },
        {
            active: false,
            disabled: false,
            name: 'This is panel header 2'
        },
        {
            active: false,
            disabled: true,
            name: 'This is panel header 3'
        }
    ];
    constructor() { }


    ngOnInit(): void {
    }

}
