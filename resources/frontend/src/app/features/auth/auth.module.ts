import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { DemoNgZorroAntdModule } from 'src/app/shared/ng-zorro-antd.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AuthLayoutComponent,
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule
  ]
})
export class AuthModule { }
