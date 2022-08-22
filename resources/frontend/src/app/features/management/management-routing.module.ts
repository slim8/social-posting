import { CreateTextMediaComponent } from './components/create-text-media/create-text-media.component';
import { CreateNewsComponent } from './components/create-news/create-news.component';
import { NewsComponent } from './components/news/news.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';

const routes: Routes = [
    { path: 'users-list', component: UsersListComponent },
    { path: 'create-user', component: CreateUserComponent },
    { path: 'edit-user/:id', component: CreateUserComponent },
    { path: 'create-news', component: CreateNewsComponent },
    { path: 'edit-news/:id', component: CreateNewsComponent },
    { path: 'news/:news/create-text-media', component: CreateTextMediaComponent },
    { path: 'news/:news/edit-text-media/:id', component: CreateTextMediaComponent },
    { path: 'news', component: NewsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
