
import { NgModule } from '@angular/core';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { IconsProviderModule } from './icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ItemLoaderComponent } from './components/item-loader/item-loader.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
    declarations: [
        NotFoundComponent,
        ServerErrorComponent,
        UnauthorizedComponent,
        ItemLoaderComponent,
    ],
    imports: [
        DemoNgZorroAntdModule
    ],
    exports: [
        DemoNgZorroAntdModule,
        IconsProviderModule,
        FormsModule,
        ReactiveFormsModule,
        ItemLoaderComponent,
        NotFoundComponent,
        ServerErrorComponent,
        UnauthorizedComponent,
        AngularEditorModule,

    ]
})
export class SharedModule {

    constructor(private messageService: NzMessageService,private jwtService: JwtHelperService) { }

    createMessage(type: string, message: any): void {
        this.messageService.create(type, ` ${message}`);
    }

    getuserRoles(): Array<string> {
      return this.jwtService.decodeToken().data.roles;
    }

    initSideMenu(param: string = '') {
        const links = document.querySelectorAll('.m-menu-item');
        links.forEach((link: any) => {
            link.parentElement.children[0].classList.remove('is-selected');
            link.classList.remove('is-selected');
        });
        let activatedLink = document.getElementsByClassName(param)[0];
        if (activatedLink) {
            activatedLink?.parentElement?.children[0].classList.add('is-selected');
            activatedLink?.parentElement?.children[1].classList.add('is-selected');
        }
    }

}
