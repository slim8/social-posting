import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { BlogPostsComponent } from './Components/blog-posts/blog-posts.component';
import { PostDetailComponent } from './Components/post-detail/post-detail.component';

@NgModule({
    declarations: [
        DashboardComponent,
        BlogPostsComponent,
        PostDetailComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule
    ]
})
export class DashboardModule { }
