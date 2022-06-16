import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublishedPostsRoutingModule } from './published-posts-routing.module';
import { PublishedPostsComponent } from './published-posts.component';


@NgModule({
  declarations: [
    PublishedPostsComponent
  ],
  imports: [
    CommonModule,
    PublishedPostsRoutingModule
  ]
})
export class PublishedPostsModule { }
