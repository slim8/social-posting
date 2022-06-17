import { DemoNgZorroAntdModule } from './../../shared/ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';


@NgModule({
  declarations: [
    UsersListComponent,
    CreateUserComponent
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
