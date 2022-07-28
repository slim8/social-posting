import { CreatePostComponent } from './../create-post/create-post.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DraftsComponent } from './drafts.component';

const routes: Routes = [
  { path: '', component: DraftsComponent },
  { path: 'edit/:draft', component: CreatePostComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DraftsRoutingModule { }
