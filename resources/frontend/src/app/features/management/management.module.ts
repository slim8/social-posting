import { DemoNgZorroAntdModule } from './../../shared/ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { NewsComponent } from './components/news/news.component';
import { CreateNewsComponent } from './components/create-news/create-news.component';


@NgModule({
  declarations: [
    UsersListComponent,
    CreateUserComponent,
    NewsComponent,
    CreateNewsComponent
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule ,
  ]
})
export class ManagementModule { }
