import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {DemoNgZorroAntdModule} from "../../shared/ng-zorro-antd.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserComponent} from "./user.component";
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
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
