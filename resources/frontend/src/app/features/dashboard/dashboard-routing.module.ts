import { BlogPostsComponent } from './Components/blog-posts/blog-posts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PostDetailComponent } from './Components/post-detail/post-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'blog-posts', component: BlogPostsComponent },
  { path: 'post/:id', component: PostDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
