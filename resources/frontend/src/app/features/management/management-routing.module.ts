import { CreateNewsComponent } from './components/create-news/create-news.component';
import { NewsComponent } from './components/news/news.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';

const routes: Routes = [
    { path: 'users-list', component: UsersListComponent },
    { path: 'create-user', component: CreateUserComponent },
    { path: 'create-news', component: CreateNewsComponent },
    { path: 'news', component: NewsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
