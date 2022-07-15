import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {DemoNgZorroAntdModule} from "../../shared/ng-zorro-antd.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserComponent} from "./user.component";
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    ChangePasswordComponent,
    EditProfileComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
