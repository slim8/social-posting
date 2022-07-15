import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedPostsRoutingModule } from './published-posts-routing.module';
import { PublishedPostsComponent } from './published-posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemLoaderComponent } from './components/item-loader/item-loader.component';


@NgModule({
    declarations: [
        PublishedPostsComponent,
        ItemLoaderComponent
    ],
    imports: [
        CommonModule,
        PublishedPostsRoutingModule,
        SharedModule
    ]
})
export class PublishedPostsModule { }
