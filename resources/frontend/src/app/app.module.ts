import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpClientModule, HttpEvent, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './shared/icons-provider.module';
import { DemoNgZorroAntdModule } from './shared/ng-zorro-antd.module';
import { Observable } from 'rxjs';
import { TokenInterceptorService } from './shared/services/token-interceptor.service'
import { JwtModule } from '@auth0/angular-jwt';
import { sharedConstants } from './shared/sharedConstants';
import { APP_BASE_HREF } from '@angular/common';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        IconsProviderModule,
        DemoNgZorroAntdModule,
        FormsModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: function tokenGetter() {
                    return localStorage.getItem(sharedConstants.HTTP_TOKEN);
                },
                allowedDomains: ['http://localhost:4200'],
                disallowedRoutes: ['http://localhost:4200/auth/login']
            }
        }),
    ],
    exports: [
        JwtModule
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
    },
    {
        provide: APP_BASE_HREF, useValue: '/'
    }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if (!req.headers.has('Content-Type')) {
            req = req.clone({
                headers: req.headers.set('Content-Type', 'application/json; charset=utf-8')
            });
        }

        if (token) {
            // If we have a token, we set it to the header
            req = req.clone({
                setHeaders: { Authorization: `Authorization token ${token}` }
            });
        }

        return next.handle(req);
    }
}
