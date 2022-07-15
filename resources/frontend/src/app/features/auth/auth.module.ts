import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { DemoNgZorroAntdModule } from 'src/app/shared/ng-zorro-antd.module';
import { FormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';


@NgModule({
    declarations: [
        AuthLayoutComponent,
        AuthLayoutComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        ForgetPasswordComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        DemoNgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AuthModule { }
