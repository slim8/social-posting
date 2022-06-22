import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedPostsRoutingModule } from './published-posts-routing.module';
import { PublishedPostsComponent } from './published-posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollapseHeaderComponent } from './components/collapse-header/collapse-header.component';


@NgModule({
    declarations: [
        PublishedPostsComponent,
        CollapseHeaderComponent
    ],
    imports: [
        CommonModule,
        PublishedPostsRoutingModule,
        SharedModule
    ]
})
export class PublishedPostsModule { }
