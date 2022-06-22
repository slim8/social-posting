import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedPostsRoutingModule } from './published-posts-routing.module';
import { PublishedPostsComponent } from './published-posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollapseItemComponent } from './components/collapse-item/collapse-item.component';


@NgModule({
    declarations: [
        PublishedPostsComponent,
        CollapseItemComponent
    ],
    imports: [
        CommonModule,
        PublishedPostsRoutingModule,
        SharedModule
    ]
})
export class PublishedPostsModule { }
