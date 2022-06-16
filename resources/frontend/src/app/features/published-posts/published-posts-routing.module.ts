import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishedPostsComponent } from './published-posts.component';

const routes: Routes = [{ path: '', component: PublishedPostsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishedPostsRoutingModule { }
